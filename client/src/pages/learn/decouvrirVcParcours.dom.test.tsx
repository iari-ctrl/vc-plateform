// @vitest-environment jsdom

import '@/test/setupDom';

import { fireEvent, screen, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserDataProvider } from '@/context/UserDataProvider';
import { learningActivityKey, learningWorkspace } from '@/lib/learningWorkspace';
import { storage } from '@/lib/storage';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';
import { renderWithRouter } from '@/test/renderApp';
import CaseStudyPage from '../cases/CaseStudyPage';
import LessonPage from './LessonPage';
import ParcoursDetailPage from './ParcoursDetailPage';

function renderRoute(path: string) {
  return renderWithRouter(
    <UserDataProvider>
      <Routes>
        <Route path="/parcours/:slug" element={<ParcoursDetailPage />} />
        <Route path="/lessons/:slug" element={<LessonPage />} />
        <Route path="/cases/:slug" element={<CaseStudyPage />} />
      </Routes>
    </UserDataProvider>,
    path,
  );
}

describe('parcours Découvrir le VC — rendu du quiz final', () => {
  beforeEach(() => {
    localStorage.clear();
    learningWorkspace.reload();
  });

  it('affiche le quiz final comme dernière étape contextualisée du parcours', () => {
    renderRoute('/parcours/le-vc-sans-bullshit?budget=high');

    const quizLinks = screen.getAllByRole('link', { name: /Quiz final/i });
    expect(quizLinks.at(-1)).toHaveAttribute(
      'href',
      '/lessons/quiz-comprendre-le-capital-risque?parcours=p-decouvrir-vc&budget=high',
    );
    expect(screen.getByText('0/9 · 0%')).toBeInTheDocument();
    expect(screen.getByText(/Jalon final :/i)).toHaveTextContent(/Non commencé|Lecture non commencée/i);
    expect(screen.getByRole('link', { name: /Ouvrir le quiz final/i })).toHaveAttribute(
      'href',
      '/lessons/quiz-comprendre-le-capital-risque?parcours=p-decouvrir-vc&budget=high',
    );
  });

  it('ignore une production homonyme persistée pour le jalon final adossé au quiz', () => {
    learningWorkspace.updateProduction('ld-decouvrir-vc-quiz', {
      note: 'État de production homonyme conservé',
    });

    renderRoute('/parcours/le-vc-sans-bullshit?budget=high');

    const quizStepLink = screen.getAllByRole('link', { name: /Quiz final/i })[0];
    expect(within(quizStepLink).queryByText(/commencé|version 1|revu|révisé|terminé/i)).not.toBeInTheDocument();
    expect(screen.getByText('0/9 · 0%')).toBeInTheDocument();
    expect(screen.getByText(/Jalon final :/i)).toHaveTextContent('Lecture non commencée');
    expect(screen.getByText(/État :/i)).toHaveTextContent('Lecture non commencée');
    expect(screen.getByRole('link', { name: 'Commencer le parcours' })).toHaveAttribute(
      'href',
      '/lessons/c-est-quoi-le-vc-vraiment?parcours=p-decouvrir-vc&budget=high',
    );
    expect(screen.queryByRole('link', { name: 'Reprendre où j’en étais' })).not.toBeInTheDocument();
  });

  it('termine la progression du parcours après lecture du quiz final et garde le cas Europe inchangé', async () => {
    const doneLessons = [
      'ld-what-is-vc',
      'ld-power-law',
      'ld-money-flow',
      'ld-stages',
      'ld-vc-job',
      'ld-roles',
      'ld-fund-lifecycle',
      'ld-decouvrir-vc-quiz',
    ];
    storage.setParsed(STORAGE_CONTRACTS.progress, Object.fromEntries(doneLessons.map((lessonId) => [
      lessonId,
      { lessonId, courseId: 'c-decouvrir-vc', pathId: 'p-decouvrir-vc', status: 'done', percent: 100 },
    ])));
    learningWorkspace.completeActivity('p-decouvrir-vc', 'case', 'cs-europe-vs-valley');

    renderRoute('/parcours/le-vc-sans-bullshit?budget=high');

    expect(await screen.findByText('9/9 · 100%')).toBeInTheDocument();
    expect(screen.getByText(/Jalon final :/i)).toHaveTextContent(/Lecture terminée|Terminé/i);
    expect(screen.getByRole('link', { name: /L'Europe n'est pas une Silicon Valley ratée/i })).toHaveAttribute(
      'href',
      '/cases/le-vc-europeen-contre-le-mythe-de-la-valley?parcours=p-decouvrir-vc&budget=high',
    );
    expect(learningWorkspace.getSnapshot().activities[learningActivityKey('p-decouvrir-vc', 'case', 'cs-europe-vs-valley')]?.completed).toBe(true);
  });

  it('rend les huit questions du quiz comme un QuizBlock réellement jouable', async () => {
    renderRoute('/lessons/quiz-comprendre-le-capital-risque?parcours=p-decouvrir-vc&budget=high');

    expect(await screen.findByRole('heading', { name: /Quiz final/i })).toBeInTheDocument();
    expect(screen.getByText(/Question 1\/8/i)).toBeInTheDocument();
    const firstQuestion = screen.getByRole('group', { name: /Quel acteur prend un engagement dans le fonds/i });
    fireEvent.click(within(firstQuestion).getByRole('button', { name: /LP — investisseur du fonds/i }));
    expect(await screen.findByText(/Question 2\/8/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Précédent.*Un fonds naît et meurt aussi/i })).toHaveAttribute(
      'href',
      '/lessons/un-fonds-nait-et-meurt-aussi?parcours=p-decouvrir-vc&budget=high',
    );
  });
});
