import { useState } from 'react';
import { BLOG } from '@/content/blog';
import { BlogCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';
import type { BlogPost } from '@/content/types';

export default function BlogPage() {
  usePageMeta('Analyses & notes de recherche', 'Lectures obliques, notes de recherche et réflexions sur le capital-risque.');
  // Editorial content changes rarely — hold the API copy fresh for 10 min.
  const posts = BLOG;
  const [category, setCategory] = useState('all');

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const categories = [...new Set(sorted.map((p) => p.category))];
  const visible = category === 'all' ? sorted : sorted.filter((p) => p.category === category);
  const oblique = visible.filter((post) => post.category === 'Lecture oblique');
  const notes = visible.filter((post) => post.category !== 'Lecture oblique');

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Analyses & notes de recherche"
          title="Analyses & notes de recherche"
          description="Les analyses restent signées, datées et canoniques à leurs URLs. Les lectures obliques forment une famille propre ; les notes et brèves accueillent les réflexions plus courtes. Les cadres méthode sont aussi accessibles depuis la salle Méthode."
        />
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Catégorie d'analyse">
          {[{ id: 'all', label: 'Tous' }, ...categories.map((c) => ({ id: c, label: c }))].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCategory(f.id)}
              aria-pressed={category === f.id}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${category === f.id ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant hover:text-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {category === 'all' ? (
        <>
          <BlogSection title="Lectures obliques" posts={oblique} featuredFirst />
          <BlogSection title="Notes & brèves" posts={notes} />
        </>
      ) : (
        <BlogSection title={category} posts={visible} featuredFirst />
      )}
    </div>
  );
}

function BlogSection({ title, posts, featuredFirst = false }: { title: string; posts: BlogPost[]; featuredFirst?: boolean }) {
  if (!posts.length) return null;
  const [featured, ...rest] = featuredFirst ? posts : [];
  const grid = featuredFirst ? rest : posts;

  return (
    <section className="mt-12">
      <Reveal>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-headline text-headline-lg font-semibold">{title}</h2>
          <span className="font-mono text-xs text-surface-variant">{posts.length}</span>
        </div>
      </Reveal>
      {featured && (
        <Reveal>
          <BlogCard post={featured} featured />
        </Reveal>
      )}
      {grid.length > 0 && (
        <div className={`${featured ? 'mt-6' : ''} grid gap-5 md:grid-cols-2 lg:grid-cols-3`}>
          {grid.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 70}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
