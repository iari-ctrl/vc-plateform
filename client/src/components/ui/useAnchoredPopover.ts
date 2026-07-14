import { useCallback, useEffect, useId, useRef, useState } from 'react';

export type PopoverPosition = {
  top: number;
  left: number;
  width: number;
  placement: 'above' | 'below';
};

export function useAnchoredPopover<TTrigger extends HTMLElement, TPanel extends HTMLElement>({
  width,
  closeDelay = 150,
  panelHeight = 210,
}: {
  width: number;
  closeDelay?: number;
  panelHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const triggerRef = useRef<TTrigger>(null);
  const panelRef = useRef<TPanel>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();

  const clearCloseTimer = useCallback(() => clearTimeout(closeTimer.current), []);

  const positionPanel = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const margin = 14;
    const resolvedWidth = Math.min(width, window.innerWidth - margin * 2);
    const center = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(center, margin + resolvedWidth / 2),
      window.innerWidth - margin - resolvedWidth / 2,
    );
    const shouldOpenAbove = rect.bottom > window.innerHeight - panelHeight && rect.top > panelHeight;

    setPosition({
      top: shouldOpenAbove ? rect.top - 10 : rect.bottom + 10,
      left,
      width: resolvedWidth,
      placement: shouldOpenAbove ? 'above' : 'below',
    });
  }, [panelHeight, width]);

  const openPreview = useCallback(() => {
    clearCloseTimer();
    positionPanel();
    setOpen(true);
  }, [clearCloseTimer, positionPanel]);

  const scheduleClose = useCallback(() => {
    if (pinned) return;
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, pinned]);

  const closeIfFocusLeaves = useCallback(() => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (pinned || triggerRef.current?.contains(active) || panelRef.current?.contains(active)) return;
      setOpen(false);
    }, 0);
  }, [pinned]);

  const togglePinned = useCallback(() => {
    clearCloseTimer();
    positionPanel();
    setPinned((current) => {
      const next = !current;
      setOpen(next);
      return next;
    });
  }, [clearCloseTimer, positionPanel]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setPinned(false);
      setOpen(false);
    };
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', positionPanel);
    window.addEventListener('scroll', positionPanel, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', positionPanel);
      window.removeEventListener('scroll', positionPanel, true);
    };
  }, [open, positionPanel]);

  return {
    open,
    pinned,
    position,
    triggerRef,
    panelRef,
    panelId,
    openPreview,
    scheduleClose,
    closeIfFocusLeaves,
    togglePinned,
  };
}
