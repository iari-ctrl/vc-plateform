// @vitest-environment jsdom
import '@/test/setupDom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActiveProse } from '@/components/reading/ActiveProse';
import { renderWithRouter } from '@/test/renderApp';

const addNoteMock = vi.hoisted(() => vi.fn());

vi.mock('@/context/UserDataContext', () => ({
  useUserData: () => ({
    addNote: addNoteMock,
  }),
}));

function selectTextInside(element: HTMLElement, text: string) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node && !node.textContent?.includes(text)) {
    node = walker.nextNode();
  }
  if (!node || !node.textContent) throw new Error(`Texte introuvable: ${text}`);

  const start = node.textContent.indexOf(text);
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, start + text.length);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

describe('ActiveProse', () => {
  beforeEach(() => {
    addNoteMock.mockReset();
    addNoteMock.mockResolvedValue({ ok: true });
  });

  it('rend les actions de sélection disponibles au clavier et les ferme avec Escape', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <ActiveProse
        source="Le capital patient suppose une lecture structurée du risque."
        sourceType="lesson"
        sourceId="lesson-1"
        sourceTitle="Leçon"
      />,
    );

    const prose = screen.getByRole('region', { name: /texte annotable/i });
    prose.focus();
    selectTextInside(prose, 'capital patient');
    fireEvent.keyUp(prose, { key: 'ArrowRight', shiftKey: true });

    expect(screen.getByRole('toolbar', { name: /actions de sélection/i })).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('toolbar', { name: /actions de sélection/i })).not.toBeInTheDocument();
    expect(prose).toHaveFocus();
  });

  it('annonce un échec addNote au lieu de le masquer', async () => {
    addNoteMock.mockResolvedValueOnce({ ok: false, reason: 'unavailable' });
    const user = userEvent.setup();
    renderWithRouter(
      <ActiveProse
        source="Le passage sélectionné doit être enregistrable."
        sourceType="case"
        sourceId="case-1"
        sourceTitle="Cas"
      />,
    );

    const prose = screen.getByRole('region', { name: /texte annotable/i });
    selectTextInside(prose, 'passage sélectionné');
    fireEvent.mouseUp(prose);

    await user.click(screen.getByRole('button', { name: /surligner/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/n’a pas pu être enregistré/i);
    });
    expect(addNoteMock).toHaveBeenCalledWith(expect.objectContaining({
      kind: 'highlight',
      body: 'passage sélectionné',
    }));
  });
});
