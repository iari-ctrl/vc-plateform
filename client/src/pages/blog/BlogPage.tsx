import { useState } from 'react';
import { BLOG } from '@/content';
import { BlogCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { useApiData } from '@/hooks/useApiData';
import { usePageMeta } from '@/lib/seo';
import type { BlogPost } from '@/content/types';

export default function BlogPage() {
  usePageMeta('Analyses & recherche', 'Articles, thèses et réflexions sur le capital-risque — penser le venture, pas seulement l’apprendre.');
  // Editorial content changes rarely — hold the API copy fresh for 10 min.
  const { data: posts } = useApiData<BlogPost[]>('/content/blog', BLOG, { staleTime: 10 * 60 * 1000 });
  const [category, setCategory] = useState('all');

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const categories = [...new Set(sorted.map((p) => p.category))];
  const visible = category === 'all' ? sorted : sorted.filter((p) => p.category === category);
  // The featured hero only makes sense on the unfiltered view.
  const featured = category === 'all' ? visible[0] : undefined;
  const rest = category === 'all' ? visible.slice(1) : visible;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading eyebrow="Analyses & recherche" title="Penser le venture" description="Thèses, méthodes et réflexions. Le contenu est libre, signé et daté — comme un carnet de recherche ouvert." />
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'Tous' }, ...categories.map((c) => ({ id: c, label: c }))].map((f) => (
            <button
              key={f.id}
              onClick={() => setCategory(f.id)}
              aria-pressed={category === f.id}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${category === f.id ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant hover:text-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {featured && (
        <Reveal className="mt-8">
          <BlogCard post={featured} featured />
        </Reveal>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post, i) => (
          <Reveal key={post.id} delay={(i % 3) * 70}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
