import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ScrollytellingProgress({
  eyebrow,
  title,
  progress,
  reducedMotion,
}: {
  eyebrow: string;
  title: string;
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#D1B875]/35 bg-[#11131A]/82 p-5 text-[#F4F2EB] shadow-editorial-lg">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#D1B875]">{eyebrow}</p>
      <p className="mt-2 font-headline text-2xl font-semibold leading-tight">{title}</p>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#F4F2EB]/16">
        <div
          className={cn('h-full origin-left rounded-full bg-[#D1B875]', reducedMotion ? '' : 'transition-transform duration-500 ease-out')}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}

export function ScrollytellingScene({
  index,
  active,
  sceneRef,
  className,
  children,
}: {
  index: number;
  active: boolean;
  sceneRef: (node: HTMLElement | null) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      ref={sceneRef}
      data-scene-index={index}
      data-active={active ? 'true' : 'false'}
      className={cn(
        'rounded-[1.4rem] border bg-surface-container-lowest p-5 shadow-editorial-sm sm:p-7 lg:min-h-[74vh] lg:p-8',
        active ? 'border-[color-mix(in_srgb,var(--primary)_55%,var(--outline-variant))]' : 'border-outline-variant',
        className,
      )}
    >
      {children}
    </section>
  );
}
