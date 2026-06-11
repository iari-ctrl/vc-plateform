import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Clock } from 'lucide-react';
import { blogBySlug, BLOG } from '@/content';
import type { BlogPost } from '@/content/types';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { BlogCard } from '@/components/cards';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { PageLoader } from '@/components/ui/primitives';
import { useApiItem } from '@/hooks/useApiData';
import { formatDateFr } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from './NotFoundPage';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { item: post, pending } = useApiItem<BlogPost>(
    slug ? `/content/blog/${slug}` : null,
    slug ? blogBySlug(slug) : undefined,
  );
  usePageMeta(post?.title, post?.excerpt);

  if (pending) return <PageLoader />;
  if (!post) return <NotFoundPage />;

  const related = BLOG.filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/blog" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Analyses</Link>

      <header>
        <div className="flex items-center justify-between gap-3">
          <span className="chip">{post.category}</span>
          <BookmarkButton item={{ itemType: 'blog', itemId: post.id, title: post.title, href: `/blog/${post.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-md font-semibold leading-[1.05] tracking-tight text-balance">{post.title}</h1>
        <p className="mt-3 font-headline text-headline-sm italic text-surface-variant">{post.subtitle}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-outline-variant py-3 text-sm text-surface-variant">
          <span className="font-medium text-foreground">{post.author}</span>
          <span>{formatDateFr(post.date)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {post.readMin} min</span>
        </div>
      </header>

      <div className="mt-8">
        <ActiveProse source={post.body} sourceType="blog" sourceId={post.id} sourceTitle={post.title} />
      </div>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <FleuronDivider className="mb-8" />
          <p className="eyebrow mb-5">À lire ensuite</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((p) => <BlogCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
    </article>
  );
}
