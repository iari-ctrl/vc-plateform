import { BLOG } from '@/content';
import { BlogCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { useApiData } from '@/hooks/useApiData';
import { usePageMeta } from '@/lib/seo';
import type { BlogPost } from '@/content/types';

export default function BlogPage() {
  usePageMeta('Analyses & recherche', 'Articles, thèses et réflexions sur le capital-risque — penser le venture, pas seulement l’apprendre.');
  const { data: posts } = useApiData<BlogPost[]>('/content/blog', BLOG);
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading eyebrow="Analyses & recherche" title="Penser le venture" description="Thèses, méthodes et réflexions. Le contenu est libre, signé et daté — comme un carnet de recherche ouvert." />
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
