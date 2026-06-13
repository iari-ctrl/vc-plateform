import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { RegionSelect } from '@/components/ikigai/IkigaiAtlasDiagram';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useIkigaiScrollPinning({
  modes,
  setActiveDim,
}: {
  modes: unknown;
  setActiveDim: Dispatch<SetStateAction<string | null>>;
}) {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Only set activeDim via observer on mobile to avoid layout calculation conflicts
      if (window.innerWidth >= 1024) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'ikigai-section-rappel') {
            setActiveDim(null);
          } else if (id.startsWith('ikigai-dim-')) {
            setActiveDim(id.replace('ikigai-dim-', ''));
          } else if (id.startsWith('ikigai-inter-')) {
            setActiveDim(id.replace('ikigai-inter-', ''));
          } else if (id.startsWith('ikigai-presque-')) {
            setActiveDim(id.replace('ikigai-presque-', ''));
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const targets = document.querySelectorAll(
      '#ikigai-section-rappel, [id^="ikigai-dim-"], [id^="ikigai-inter-"], [id^="ikigai-presque-"]'
    );
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
      observer.disconnect();
    };
  }, [setActiveDim]);

  useEffect(() => {
    const handleScroll = () => {
      const pinContainer = pinContainerRef.current;
      const scrollContent = scrollContentRef.current;
      if (!pinContainer || !scrollContent) return;

      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        scrollContent.scrollTop = 0;
        return;
      }

      const rect = pinContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) return;

      const scrolledPastTop = -rect.top;
      let progress = 0;
      if (scrolledPastTop > 0) {
        progress = Math.min(scrolledPastTop / totalScrollable, 1);
      }

      const contentHeight = scrollContent.scrollHeight;
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      
      // Scroll the left column programmatically
      scrollContent.scrollTop = progress * maxScroll;

      // Find the active element closest to the middle of the viewport
      const targets = scrollContent.querySelectorAll(
        '#ikigai-section-rappel, [id^="ikigai-dim-"], [id^="ikigai-inter-"], [id^="ikigai-presque-"]'
      );
      let closestId = '';
      let minDistance = Infinity;

      targets.forEach((target) => {
        const targetRect = target.getBoundingClientRect();
        const targetCenter = targetRect.top + targetRect.height / 2;
        const distance = Math.abs(targetCenter - viewportHeight / 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = target.id;
        }
      });

      if (closestId) {
        if (closestId === 'ikigai-section-rappel') {
          setActiveDim(null);
        } else if (closestId.startsWith('ikigai-dim-')) {
          setActiveDim(closestId.replace('ikigai-dim-', ''));
        } else if (closestId.startsWith('ikigai-inter-')) {
          setActiveDim(closestId.replace('ikigai-inter-', ''));
        } else if (closestId.startsWith('ikigai-presque-')) {
          setActiveDim(closestId.replace('ikigai-presque-', ''));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });
    if (scrollContentRef.current) {
      resizeObserver.observe(scrollContentRef.current);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      resizeObserver.disconnect();
    };
  }, [modes, setActiveDim]);

  function scrollTo(target: string, block: ScrollLogicalPosition = 'start') {
    const el = document.getElementById(target);
    if (!el) return;

    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) {
      el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block });
      return;
    }

    const pinContainer = pinContainerRef.current;
    const scrollContent = scrollContentRef.current;
    if (!pinContainer || !scrollContent) {
      el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block });
      return;
    }

    const rect = pinContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const totalScrollable = rect.height - viewportHeight;
    const contentHeight = scrollContent.scrollHeight;
    const maxScroll = Math.max(0, contentHeight - viewportHeight);

    if (totalScrollable <= 0 || maxScroll <= 0) return;

    let elementOffsetTop = 0;
    let current: HTMLElement | null = el;
    while (current && current !== scrollContent) {
      elementOffsetTop += current.offsetTop;
      current = current.offsetParent as HTMLElement;
    }

    let targetScrollTop = 0;
    if (block === 'center') {
      targetScrollTop = elementOffsetTop - (viewportHeight / 2) + (el.offsetHeight / 2);
    } else {
      targetScrollTop = elementOffsetTop;
    }

    targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));
    const progress = targetScrollTop / maxScroll;
    const targetWindowScrollTop = window.scrollY + rect.top + progress * totalScrollable;

    window.scrollTo({
      top: targetWindowScrollTop,
      behavior: prefersReduced() ? 'auto' : 'smooth',
    });
  }

  function handleRegion(r: RegionSelect) {
    if (r.kind === 'dimension') {
      setActiveDim(r.id);
      scrollTo(r.target, 'center');
    } else {
      scrollTo(r.target, 'start');
    }
  }

  return { pinContainerRef, scrollContentRef, scrollTo, handleRegion };
}
