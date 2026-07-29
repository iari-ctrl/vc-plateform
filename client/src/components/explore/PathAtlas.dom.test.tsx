// @vitest-environment jsdom
import '@/test/setupDom';

import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { PathAtlas } from '@/components/explore/PathAtlas';
import { ThemeProvider } from '@/context/ThemeProvider';
import { UserDataProvider } from '@/context/UserDataProvider';
import { renderWithRouter } from '@/test/renderApp';

function renderAtlas() {
  return renderWithRouter(
    <ThemeProvider>
      <UserDataProvider>
        <PathAtlas />
        <LocationProbe />
      </UserDataProvider>
    </ThemeProvider>,
  );
}

function LocationProbe() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

function touchPointerDown(element: Element) {
  fireEvent.pointerDown(element, { pointerType: 'touch' });
}

describe('PathAtlas — relations entre parcours', () => {
  it('ne rend que les relations du sceau survolé, puis les retire à la sortie', async () => {
    const user = userEvent.setup();
    const { container } = renderAtlas();
    const seal = screen.getByRole('link', { name: /^Comprendre le capital-risque —/ });

    expect(screen.queryByTestId('path-atlas-relations')).not.toBeInTheDocument();

    await user.hover(seal);

    const group = screen.getByTestId('path-atlas-relations');
    const paths = [...group.querySelectorAll<SVGPathElement>('[data-parcours-relation]')];
    expect(group).toHaveAttribute('aria-hidden', 'true');
    expect(group).toHaveAttribute('pointer-events', 'none');
    expect(paths).toHaveLength(4);
    expect(paths.every((path) => (
      path.dataset.sourceId === 'p-decouvrir-vc' || path.dataset.targetId === 'p-decouvrir-vc'
    ))).toBe(true);

    const peer = container.querySelector<SVGPathElement>('[data-relation-kind="peer"]');
    const progression = container.querySelector<SVGPathElement>('[data-relation-kind="progression"]');
    expect(peer).toHaveAttribute('stroke-dasharray', '2 7');
    expect(peer).not.toHaveAttribute('marker-end');
    expect(progression).toHaveAttribute(
      'marker-end',
      `url(#${container.querySelector('marker')?.id})`,
    );
    expect(peer?.getAttribute('stroke')).not.toBe(progression?.getAttribute('stroke'));
    const activeLabel = [...container.querySelectorAll<SVGTextElement>('svg text')]
      .find((text) => text.textContent?.includes('Comprendre le capital-risque'));
    const sealCenterX = Number(seal.querySelector('circle')?.getAttribute('cx'));
    expect(activeLabel).toHaveAttribute('text-anchor', 'start');
    expect(Number(activeLabel?.getAttribute('x'))).toBeGreaterThan(sealCenterX);

    await user.unhover(seal);
    expect(screen.queryByTestId('path-atlas-relations')).not.toBeInTheDocument();
  });

  it('scope le marqueur de progression à chaque instance de l’atlas', () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <UserDataProvider>
          <PathAtlas />
          <PathAtlas />
        </UserDataProvider>
      </ThemeProvider>,
    );
    const atlases = [...container.querySelectorAll<SVGSVGElement>('svg[aria-label^="Carte interactive"]')];
    const markerIds = atlases.map((atlas) => atlas.querySelector('marker')?.id);

    expect(atlases).toHaveLength(2);
    expect(markerIds.every(Boolean)).toBe(true);
    expect(new Set(markerIds).size).toBe(2);

    for (const atlas of atlases) {
      const seal = atlas.querySelector<SVGGElement>(
        'g[role="link"][aria-label^="Comprendre le capital-risque —"]',
      );
      fireEvent.focus(seal!);

      const progression = atlas.querySelector<SVGPathElement>('[data-relation-kind="progression"]');
      expect(progression).toHaveAttribute('marker-end', `url(#${atlas.querySelector('marker')?.id})`);
    }
  });

  it('expose les mêmes relations au focus clavier, y compris les liens entrants', () => {
    const { container } = renderAtlas();
    const seal = screen.getByRole('link', { name: /^Réussir l.entretien Associate —/ });

    act(() => seal.focus());

    expect(seal).toHaveFocus();
    expect(container.querySelector(
      '[data-source-id="p-entretien-analyst"][data-target-id="p-entretien-associate"]',
    )).toBeInTheDocument();
    const relationDescriptionId = seal.getAttribute('aria-describedby');
    expect(relationDescriptionId).toBeTruthy();
    expect(document.getElementById(relationDescriptionId!)).toHaveTextContent(
      /Prépare à Réussir l'entretien Associate|Socle conseillé : Réussir l'entretien Analyst/,
    );

    act(() => seal.blur());
    expect(screen.queryByTestId('path-atlas-relations')).not.toBeInTheDocument();
  });

  it('restaure le voisinage du sceau focalisé après un survol temporaire', async () => {
    const user = userEvent.setup();
    const { container } = renderAtlas();
    const focusedNode = screen.getByRole('link', { name: /^Réussir l'entretien Associate —/ });
    const hoveredNode = screen.getByRole('link', { name: /^Comprendre le capital-risque —/ });
    const expectOnlyRelationsFor = (parcoursId: string) => {
      const relations = [...container.querySelectorAll<SVGPathElement>('[data-parcours-relation]')];
      expect(relations.length).toBeGreaterThan(0);
      expect(
        relations.every(
          (path) => path.dataset.sourceId === parcoursId || path.dataset.targetId === parcoursId,
        ),
      ).toBe(true);
    };

    act(() => focusedNode.focus());
    expectOnlyRelationsFor('p-entretien-associate');

    await user.hover(hoveredNode);
    expectOnlyRelationsFor('p-decouvrir-vc');

    await user.unhover(hoveredNode);
    expectOnlyRelationsFor('p-entretien-associate');
  });

  it('maintient les deux lignes du libellé actif hors du sceau', () => {
    const { container } = renderAtlas();
    const seals = [...container.querySelectorAll<SVGGElement>('svg g[role="link"]')];

    for (const seal of seals) {
      fireEvent.focus(seal);
      const label = [...seal.querySelectorAll('text')]
        .find((text) => text.querySelectorAll('tspan').length === 2);
      if (!label) continue;

      const titleLine = label.querySelectorAll('tspan')[1];
      const center = Number(seal.querySelector('circle')?.getAttribute('cy'));
      const outerRadius = Math.max(
        ...[...seal.querySelectorAll('circle')].map((circle) => Number(circle.getAttribute('r'))),
      );
      const firstBaseline = Number(label.getAttribute('y'));
      const titleBaseline = firstBaseline + Number(titleLine.getAttribute('dy'));

      if (firstBaseline < center) {
        expect(titleBaseline).toBeLessThanOrEqual(center - outerRadius - 4);
      } else {
        expect(firstBaseline).toBeGreaterThanOrEqual(center + outerRadius + 4);
      }
    }
  });

  it('place le cartouche de description en bas à droite sur écran large', () => {
    const { container } = renderAtlas();
    const seal = screen.getByRole('link', { name: /^Comprendre le capital-risque —/ });
    fireEvent.focus(seal);

    const description = document.getElementById(seal.getAttribute('aria-describedby')!);
    expect(description?.parentElement).toHaveClass('relative', 'sm:absolute');
    expect(description?.parentElement).toHaveClass('sm:bottom-4', 'sm:right-4');
    expect(description?.parentElement).not.toHaveClass('sm:top-4', 'sm:bottom-auto');
    expect(description?.parentElement).not.toHaveClass('absolute');
    expect(container.querySelector('.map-paper')).toHaveClass('flex-col', 'sm:block');
  });

  it('révèle les relations au premier appui tactile puis navigue au second', async () => {
    renderAtlas();
    const chip = screen.getByRole('link', { name: /Comprendre le capital-risque$/ });

    touchPointerDown(chip);
    fireEvent.click(chip);

    expect(screen.getByTestId('location')).toHaveTextContent('/');
    const relations = await screen.findByTestId('path-atlas-relations');
    expect(relations.querySelectorAll('[data-parcours-relation]')).toHaveLength(4);
    expect(chip).toHaveAttribute('aria-describedby');

    touchPointerDown(chip);
    fireEvent.click(chip);

    expect(screen.getByTestId('location')).toHaveTextContent('/parcours/le-vc-sans-bullshit');
  });

  it('applique le même double appui tactile aux sceaux SVG', async () => {
    renderAtlas();
    const seal = screen.getByRole('link', { name: /Comprendre le capital-risque —/ });

    touchPointerDown(seal);
    fireEvent.click(seal);

    expect(screen.getByTestId('location')).toHaveTextContent('/');
    const relations = await screen.findByTestId('path-atlas-relations');
    expect(relations.querySelectorAll('[data-parcours-relation]')).toHaveLength(4);

    touchPointerDown(seal);
    fireEvent.click(seal);

    expect(screen.getByTestId('location')).toHaveTextContent('/parcours/le-vc-sans-bullshit');
  });
});
