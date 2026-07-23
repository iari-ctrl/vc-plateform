// @vitest-environment jsdom
import '@/test/setupDom';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { QuizBlock } from '@/components/reading/QuizBlock';
import { renderWithRouter } from '@/test/renderApp';

const quiz = [{
  question: 'Quel calcul fonde la dilution post-money ?',
  options: [
    { text: 'Levée divisée par la valorisation post-money.', correct: true },
    { text: 'Levée divisée par la valorisation pre-money.', correct: false },
  ],
  explanation: 'La dilution se calcule sur la valorisation post-money.',
}];

describe('QuizBlock', () => {
  it('expose un groupe radio nommé, verrouille la réponse validée et annonce le résultat', async () => {
    const user = userEvent.setup();
    renderWithRouter(<QuizBlock quiz={quiz} />);

    const group = screen.getByRole('radiogroup', { name: /quel calcul fonde la dilution post-money/i });
    const correctAnswer = within(group).getByRole('radio', { name: /levée divisée par la valorisation post-money/i });
    const wrongAnswer = within(group).getByRole('radio', { name: /pre-money/i });

    await user.tab();
    expect(correctAnswer).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(wrongAnswer).toBeChecked();
    await user.keyboard('{ArrowUp}');
    expect(correctAnswer).toBeChecked();

    await user.click(screen.getByRole('button', { name: /valider la réponse/i }));

    expect(correctAnswer).toBeDisabled();
    expect(wrongAnswer).toBeDisabled();
    expect(screen.getByRole('status', { name: /résultat de la question/i })).toHaveTextContent(/réponse correcte/i);
    expect(screen.getByRole('status', { name: /score du quiz/i })).toHaveTextContent('1 / 1');
  });
});
