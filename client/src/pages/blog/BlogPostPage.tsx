import { lazy, Suspense, type ComponentType } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, ScrollText } from 'lucide-react';
import { blogBySlug, BLOG } from '@/content/blog';
import type { BlogPost } from '@/content/types';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { BlogCard, GlossaryRefList } from '@/components/cards';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { PageLoader } from '@/components/ui/primitives';
import { cn, formatDateFr } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

// Scrollytelling variants are heavy (scenes, looping video) — keep them out of
// the main blog chunk and load on demand when ?view=scrolly is selected.
const HirschmanScrollytelling = lazy(() =>
  import('./HirschmanScrollytelling').then((m) => ({ default: m.HirschmanScrollytelling })),
);
const DebordScrollytelling = lazy(() =>
  import('./DebordScrollytelling').then((m) => ({ default: m.DebordScrollytelling })),
);

const SCROLLYTELLING: Record<string, ComponentType<{ post: BlogPost }>> = {
  'exit-voice-loyalty-hirschman': HirschmanScrollytelling,
  'la-societe-du-spectacle-leve-des-fonds': DebordScrollytelling,
};

function ReadingViewSwitch({
  view,
  onChange,
}: {
  view: 'article' | 'scrolly';
  onChange: (view: 'article' | 'scrolly') => void;
}) {
  return (
    <div
      role="group"
      aria-label="Choisir la version de lecture"
      className="inline-flex rounded-full border border-outline-variant bg-surface-container-low p-1"
    >
      <button
        type="button"
        aria-pressed={view === 'article'}
        onClick={() => onChange('article')}
        className={cn(
          'inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-colors sm:px-4',
          view === 'article'
            ? 'bg-surface-container-lowest text-foreground shadow-editorial-xs'
            : 'text-surface-variant hover:text-foreground',
        )}
      >
        <BookOpen size={14} aria-hidden />
        Article
      </button>
      <button
        type="button"
        aria-pressed={view === 'scrolly'}
        onClick={() => onChange('scrolly')}
        className={cn(
          'inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-colors sm:px-4',
          view === 'scrolly'
            ? 'bg-secondary text-secondary-foreground shadow-editorial-xs'
            : 'text-surface-variant hover:text-foreground',
        )}
      >
        <ScrollText size={14} aria-hidden />
        Scrollytelling
      </button>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const post = slug ? blogBySlug(slug) : undefined;
  usePageMeta(post?.title, post?.excerpt, { type: 'article', publishedTime: post?.date });

  if (!post) return <NotFoundPage />;

  const related = BLOG.filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);
  const ScrollyComponent = SCROLLYTELLING[post.slug];
  const hasScrollytelling = Boolean(ScrollyComponent);
  const view: 'article' | 'scrolly' = hasScrollytelling && searchParams.get('view') === 'scrolly' ? 'scrolly' : 'article';

  function setView(nextView: 'article' | 'scrolly') {
    const nextParams = new URLSearchParams(searchParams);
    if (nextView === 'scrolly') nextParams.set('view', 'scrolly');
    else nextParams.delete('view');
    setSearchParams(nextParams);
  }

  return (
    <article className={cn('mx-auto px-4 py-12 sm:px-6', view === 'scrolly' ? 'max-w-[88rem]' : 'max-w-2xl')}>
      <div className={cn(view === 'scrolly' && 'mx-auto max-w-3xl')}>
        <Link to="/blog" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Analyses</Link>
      </div>

      <header className={cn(view === 'scrolly' && 'mx-auto max-w-3xl')}>
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
        {post.books && post.books.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {post.books.map((b) => (
              <p key={b.title} className="inline-flex items-center gap-2 text-sm text-surface-variant">
                <BookOpen size={15} className="shrink-0" />
                <span><span className="font-medium italic text-foreground">{b.title}</span> — {b.author}{b.year ? ` (${b.year})` : ''}</span>
              </p>
            ))}
          </div>
        )}
        {hasScrollytelling && (
          <div className="mt-6">
            <ReadingViewSwitch view={view} onChange={setView} />
          </div>
        )}
      </header>

      {view === 'scrolly' && ScrollyComponent ? (
        <Suspense fallback={<PageLoader />}>
          <ScrollyComponent post={post} />
        </Suspense>
      ) : (
        <div className="mt-8">
          <ActiveProse source={post.body} sourceType="blog" sourceId={post.id} sourceTitle={post.title} />
        </div>
      )}

      <div className={cn(view === 'scrolly' && 'mx-auto max-w-2xl')}>
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
          </div>
        )}

        {post.glossaryRefs && post.glossaryRefs.length > 0 && (
          <div className="mt-8">
            <GlossaryRefList slugs={post.glossaryRefs} title="Pour aller plus loin" />
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
      </div>
    </article>
  );
}
