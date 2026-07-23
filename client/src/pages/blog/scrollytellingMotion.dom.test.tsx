// @vitest-environment jsdom
import '@/test/setupDom';

import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BlogPost } from '@/content/types';
import { DebordScrollytelling } from '@/pages/blog/DebordScrollytelling';
import { HirschmanScrollytelling } from '@/pages/blog/HirschmanScrollytelling';

const debordPost: BlogPost = {
  id: 'blog-debord',
  slug: 'la-societe-du-spectacle-leve-des-fonds',
  status: 'published',
  title: 'La Société du spectacle lève des fonds',
  subtitle: 'Lecture guidée',
  author: 'VC Platform',
  date: '2026-07-23',
  readMin: 12,
  category: 'Analyse',
  excerpt: 'Lecture scrollytelling de Debord appliquée aux levées de fonds.',
  tags: ['scrollytelling'],
  body: 'Article de test.',
};

const hirschmanPost: BlogPost = {
  ...debordPost,
  id: 'blog-hirschman',
  slug: 'exit-voice-loyalty-hirschman',
  title: 'Exit, voice and loyalty',
};

function installMatchMedia({ reducedMotion = false, desktop = false }: { reducedMotion?: boolean; desktop?: boolean }) {
  vi.stubGlobal('matchMedia', vi.fn((query: string): MediaQueryList => ({
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : query.includes('min-width: 1024px') ? desktop : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

function mobileMediaFigures(container: HTMLElement) {
  return Array.from(container.querySelectorAll('figure')).filter((figure) => figure.className.includes('lg:hidden'));
}

function renderedMedia(container: HTMLElement) {
  return Array.from(container.querySelectorAll('img, video'));
}

beforeEach(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn(() => Promise.resolve()),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
});

describe('scrollytelling media and motion contract', () => {
  it('respecte la réduction du mouvement dès le premier rendu', () => {
    installMatchMedia({ reducedMotion: true, desktop: true });

    const html = renderToStaticMarkup(<DebordScrollytelling post={debordPost} />);

    expect(html).not.toContain('<video');
    expect(html).not.toContain('will-change-transform');
  });

  it.each([
    ['Debord', <DebordScrollytelling post={debordPost} />],
    ['Hirschman', <HirschmanScrollytelling post={hirschmanPost} />],
  ])('ne monte que la branche média desktop pour %s en viewport large', (_label, component) => {
    installMatchMedia({ desktop: true });

    const { container } = render(component);

    expect(container.querySelector('aside')).toBeInTheDocument();
    expect(mobileMediaFigures(container)).toHaveLength(0);
  });

  it.each([
    ['Debord', <DebordScrollytelling post={debordPost} />],
    ['Hirschman', <HirschmanScrollytelling post={hirschmanPost} />],
  ])('ne monte que la branche média mobile pour %s en viewport étroit', (_label, component) => {
    installMatchMedia({ desktop: false });

    const { container } = render(component);

    expect(container.querySelector('aside')).not.toBeInTheDocument();
    expect(mobileMediaFigures(container).length).toBeGreaterThan(0);
  });

  it('ne lance pas les vidéos de scènes mobiles par attribut autoplay', () => {
    installMatchMedia({ desktop: false });

    const { container } = render(<DebordScrollytelling post={debordPost} />);

    expect(container.querySelectorAll('figure video[autoplay]')).toHaveLength(0);
  });

  it.each([
    ['Debord desktop', true, <DebordScrollytelling post={debordPost} />],
    ['Debord mobile', false, <DebordScrollytelling post={debordPost} />],
    ['Hirschman desktop', true, <HirschmanScrollytelling post={hirschmanPost} />],
    ['Hirschman mobile', false, <HirschmanScrollytelling post={hirschmanPost} />],
  ])('expose les dimensions intrinsèques des médias pour %s', (_label, desktop, component) => {
    installMatchMedia({ desktop });

    const { container } = render(component);

    expect(renderedMedia(container).length).toBeGreaterThan(0);
    renderedMedia(container).forEach((node) => {
      expect(node).toHaveAttribute('width');
      expect(node).toHaveAttribute('height');
    });
  });
});
