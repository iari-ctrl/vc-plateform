import { Bookmark as BookmarkIcon } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/content/types';

export function BookmarkButton({ item, variant = 'icon', className }: { item: Bookmark; variant?: 'icon' | 'labelled'; className?: string }) {
  const { isBookmarked, toggleBookmark } = useUserData();
  const saved = isBookmarked(item.itemType, item.itemId);

  if (variant === 'labelled') {
    return (
      <button
        onClick={() => toggleBookmark(item)}
        className={cn('btn-ghost', saved && 'border-[color-mix(in_srgb,var(--primary)_50%,transparent)] text-[color:var(--primary)]', className)}
        aria-pressed={saved}
      >
        <BookmarkIcon size={15} className={saved ? 'fill-current' : ''} />
        {saved ? 'Enregistré' : 'Enregistrer'}
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleBookmark(item)}
      aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={saved}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border transition-all',
        saved
          ? 'border-[color-mix(in_srgb,var(--primary)_50%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[color:var(--primary)]'
          : 'border-outline-variant text-surface-variant hover:text-foreground hover:bg-surface-container-low',
        className,
      )}
    >
      <BookmarkIcon size={15} className={saved ? 'fill-current' : ''} />
    </button>
  );
}
