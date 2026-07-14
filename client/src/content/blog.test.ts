import { describe, expect, it } from 'vitest';

import { BLOG, blogBySlug } from './blog';
import { searchLocal } from './search';

describe('blog publication gate', () => {
  it('keeps articles without an explicit status published', () => {
    expect(blogBySlug('voir-comme-un-etat')).toBeDefined();
  });

  it('excludes drafts from the public catalogue and slug resolver', () => {
    expect(BLOG.some((post) => post.status === 'draft')).toBe(false);
    expect(blogBySlug('flatland-cecite-dimensionnelle')).toBeUndefined();
  });

  it('excludes drafts from offline search', () => {
    const draftHit = searchLocal('Flatland').find(
      (hit) => hit.type === 'blog' && hit.slug === 'flatland-cecite-dimensionnelle',
    );

    expect(draftHit).toBeUndefined();
  });
});
