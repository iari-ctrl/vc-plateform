// @vitest-environment jsdom
import '@/test/setupDom';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { QuizBlock } from '@/components/reading/QuizBlock';
import type { QuizQuestion } from '@/content/types';
import { renderWithRouter } from '@/test/renderApp';

const quiz: QuizQuestion[] = [
  {
    question: 'Quel calcul fonde la dilution post-money ?',
    options: [
      { text: 'Levée divisée par la valorisation post-money.', correct: true },
      { text: 'Levée divisée par la valorisation pre-money.', correct: false },
    ],
    explanation: 'La dilution se calcule sur la valorisation post-money.',
  },
  {
    question: 'Que signale une dilution plus élevée que prévu ?',
    options: [
      { text: 'Un tour relutif pour les fondateurs.', correct: false },
      { text: 'Un besoin de financement ou une valorisation moins favorable.', correct: true },
    ],
    explanation: 'Une dilution élevée signale un besoin de financement plus important, une valorisation plus basse ou les deux.',
  },
];

describe('QuizBlock', () => {
  it('affiche une question à la fois et avance dès le choix sans action de validation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<QuizBlock quiz={quiz} />);

    const firstQuestion = screen.getByRole('group', { name: /quel calcul fonde la dilution post-money/i });
    expect(screen.queryByRole('group', { name: /que signale une dilution/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /valider|suivant/i })).not.toBeInTheDocument();

    await user.click(within(firstQuestion).getByRole('button', { name: /valorisation post-money/i }));

    const secondQuestion = await screen.findByRole('group', { name: /que signale une dilution/i });
    expect(screen.queryByRole('group', { name: /quel calcul fonde la dilution post-money/i })).not.toBeInTheDocument();
    expect(screen.getByText(/question 2\s*\/\s*2/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /valider|suivant/i })).not.toBeInTheDocument();

    await user.click(within(secondQuestion).getByRole('button', { name: /tour relutif/i }));

    const score = await screen.findByRole('status', { name: /score du quiz/i });
    expect(score).toHaveTextContent('1 / 2');
    expect(screen.queryByRole('group', { name: /que signale une dilution/i })).not.toBeInTheDocument();

    await user.click(screen.getByText(/voir le corrigé détaillé/i));
    expect(screen.getByText(/la dilution se calcule sur la valorisation post-money/i)).toBeVisible();
    expect(screen.getByText(/réponse incorrecte/i)).toBeVisible();
  });

  it('garde un parcours clavier prévisible entre les questions et le score', async () => {
    const user = userEvent.setup();
    renderWithRouter(<QuizBlock quiz={quiz} />);

    const firstAnswer = screen.getByRole('button', { name: /valorisation post-money/i });
    await user.tab();
    expect(firstAnswer).toHaveFocus();

    await user.keyboard('{Enter}');

    const secondTitle = await screen.findByRole('heading', { name: /que signale une dilution/i });
    expect(secondTitle).toHaveFocus();

    await user.tab();
    const secondAnswer = screen.getByRole('button', { name: /tour relutif/i });
    expect(secondAnswer).toHaveFocus();

    await user.keyboard('{Enter}');

    const score = await screen.findByRole('status', { name: /score du quiz/i });
    expect(score).toHaveFocus();
  });
});
