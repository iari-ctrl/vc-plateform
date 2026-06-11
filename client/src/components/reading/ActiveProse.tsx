import { useCallback, useEffect, useRef, useState } from 'react';
import { Highlighter, Quote, Check } from 'lucide-react';
import { Markdown } from '@/lib/markdown';
import { useUserData } from '@/context/UserDataContext';

interface Props {
  source: string;
  sourceType: 'lesson' | 'case' | 'blog' | 'anti-portfolio' | 'memo';
  sourceId: string;
  sourceTitle: string;
  className?: string;
}

/** Renders editorial prose with a select-to-annotate toolbar (highlight / quote → notebook). */
export function ActiveProse({ source, sourceType, sourceId, sourceTitle, className }: Props) {
  const { addNote } = useUserData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<{ text: string; top: number; left: number } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const onSelect = useCallback(() => {
    const selection = window.getSelection();
    const container = containerRef.current;
    if (!selection || selection.isCollapsed || !container) {
      setSel(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length < 4 || !container.contains(selection.anchorNode)) {
      setSel(null);
      return;
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setSel({
      text,
      top: rect.top - cRect.top - 48,
      left: Math.min(Math.max(rect.left - cRect.left + rect.width / 2, 80), cRect.width - 80),
    });
  }, []);

  useEffect(() => {
    const close = () => setSel(null);
    document.addEventListener('scroll', close, true);
    return () => document.removeEventListener('scroll', close, true);
  }, []);

  async function save(kind: 'highlight' | 'quote') {
    if (!sel) return;
    await addNote({ kind, body: sel.text, sourceType, sourceId, sourceTitle });
    setFlash(kind === 'quote' ? 'Citation ajoutée au carnet' : 'Passage surligné et sauvegardé');
    setSel(null);
    window.getSelection()?.removeAllRanges();
    setTimeout(() => setFlash(null), 2200);
  }

  return (
    <div className="relative" ref={containerRef} onMouseUp={onSelect} onTouchEnd={onSelect}>
      <Markdown source={source} className={className ?? 'prose-editorial'} glossaryPreview={sourceType === 'lesson'} />

      {sel && (
        <div
          className="absolute z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest p-1 shadow-editorial-lg animate-scale-in"
          style={{ top: sel.top, left: sel.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button onClick={() => save('highlight')} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-surface-variant transition-colors hover:bg-surface-container hover:text-foreground">
            <Highlighter size={14} /> Surligner
          </button>
          <span className="h-4 w-px bg-outline-variant" />
          <button onClick={() => save('quote')} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-surface-variant transition-colors hover:bg-surface-container hover:text-foreground">
            <Quote size={14} /> Citer
          </button>
        </div>
      )}

      {flash && (
        <div className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[color:var(--secondary)] px-4 py-2.5 text-sm text-[color:var(--on-secondary)] shadow-editorial-lg animate-fade-up">
          <Check size={15} className="text-[color:var(--primary)]" /> {flash}
        </div>
      )}
    </div>
  );
}
