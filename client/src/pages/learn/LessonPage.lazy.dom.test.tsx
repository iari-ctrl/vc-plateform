// @vitest-environment jsdom

import '@/test/setupDom';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserDataProvider } from '@/context/UserDataProvider';
import { renderWithRouter } from '@/test/renderApp';
import { LESSONS } from '@/content/lessons';
import type { Lesson } from '@/content/types';
import LessonPage from './LessonPage';

const mocks = vi.hoisted(() => ({
  loadLesson: vi.fn(),
}));

vi.mock('@/content', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/content')>();
  return { ...actual, loadLesson: mocks.loadLesson };
});

vi.mock('@/content/lessons', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/content/lessons')>();
  return { ...actual, loadLesson: mocks.loadLesson };
});

const publishedLessonFixture = LESSONS.find((lesson) => lesson.status === 'published');
if (!publishedLessonFixture) throw new Error('Fixture de leçon publiée absente.');
const publishedLesson = publishedLessonFixture;

const loadedLesson: Lesson = {
  ...publishedLesson,
  body: 'Corps de la leçon chargé après reprise.',
  keyTakeaways: [],
};

function renderLessonPage() {
  return renderWithRouter(
    <UserDataProvider>
      <Routes>
        <Route path="/lessons/:slug" element={<LessonPage />} />
      </Routes>
    </UserDataProvider>,
    `/lessons/${publishedLesson.slug}`,
  );
}

describe('LessonPage lazy content recovery', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.loadLesson.mockReset();
  });

  it('annonce un rejet du corps différé puis charge la leçon après Réessayer', async () => {
    mocks.loadLesson
      .mockRejectedValueOnce(new Error('chunk indisponible'))
      .mockResolvedValueOnce(loadedLesson);

    renderLessonPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('Le contenu de la leçon n’a pas pu être chargé');
    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(await screen.findByRole('heading', { level: 1, name: loadedLesson.title })).toBeVisible();
    expect(screen.getByText('Corps de la leçon chargé après reprise.')).toBeVisible();
    expect(mocks.loadLesson).toHaveBeenCalledTimes(2);
  });

  it('masque les références Markdown et structurées jusqu’à l’ouverture du panneau', async () => {
    const lessonWithReferences: Lesson = {
      ...loadedLesson,
      body: [
        'Corps principal visible seul.',
        '## Références',
        '- [Source Markdown masquée](https://example.com/source-markdown)',
      ].join('\n\n'),
      bodyShort: undefined,
      keyTakeaways: ['Synthèse conservée avant les références.'],
      quiz: [
        {
          question: 'Question de positionnement du quiz',
          options: [
            { text: 'Réponse valide', correct: true },
            { text: 'Réponse incorrecte', correct: false },
          ],
          explanation: 'Explication du test.',
        },
      ],
      furtherReading: [
        { kind: 'external', ref: 'https://example.com/source-structuree', label: 'Source structurée externe' },
        { kind: 'lesson', ref: publishedLesson.id, label: 'Leçon structurée interne' },
      ],
    };
    mocks.loadLesson.mockResolvedValueOnce(lessonWithReferences);

    renderLessonPage();

    expect(await screen.findByText((_, node) => node?.tagName === 'P' && node.textContent === 'Corps principal visible seul.')).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Références' })).not.toBeInTheDocument();
    expect(screen.queryByText('Source Markdown masquée')).not.toBeInTheDocument();
    expect(screen.queryByText('Source structurée externe')).not.toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /afficher les références/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const takeaways = screen.getByText('À retenir');
    const quiz = screen.getByRole('heading', { name: 'Vérifiez votre compréhension' });
    expect(takeaways.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(toggle.compareDocumentPosition(quiz) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('heading', { name: 'Références' })).toBeVisible();
    const markdownLink = screen.getByRole('link', { name: /source markdown masquée/i });
    expect(markdownLink).toBeVisible();
    expect(markdownLink).toHaveAttribute('target', '_blank');
    expect(markdownLink).toHaveAttribute('rel', 'noopener noreferrer');

    const externalLink = screen.getByRole('link', { name: /source structurée externe/i });
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'Leçon structurée interne' })).toHaveAttribute('href', `/lessons/${publishedLesson.slug}`);
  });
});
