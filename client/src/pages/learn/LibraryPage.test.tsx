import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { LESSONS } from '@/content/lessons';
import LibraryPage from './LibraryPage';

const lessonHref = (id: string) => {
  const lesson = LESSONS.find((candidate) => candidate.id === id);
  if (!lesson) throw new Error(`Leçon de test absente : ${id}`);
  return `/lessons/${lesson.slug}`;
};

describe('LibraryPage', () => {
  it('filtre les leçons selon leur niveau propre plutôt que celui de leur cours', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/bibliotheque?type=lesson&level=debutant']}>
        <LibraryPage />
      </MemoryRouter>,
    );

    expect(html).toContain(`href="${lessonHref('l-sourcing')}"`);
    expect(html).not.toContain(`href="${lessonHref('l-portfolio-monitoring')}"`);
  });
});
