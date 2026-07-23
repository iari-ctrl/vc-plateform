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
});
