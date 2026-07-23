import { useEffect, useId, useRef, type RefObject } from 'react';

export const LAYER_ROOT_ATTRIBUTE = 'data-vcpx-layer-root';
export const LAYER_ID_ATTRIBUTE = 'data-vcpx-layer-id';

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

type InertSnapshot = {
  hadAttribute: boolean;
  attributeValue: string | null;
  propertyValue: boolean;
};

type HTMLElementWithInert = HTMLElement & { inert?: boolean };

type UseLayerBehaviorOptions = {
  open: boolean;
  layerRootRef: RefObject<HTMLElement | null>;
  focusRootRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  restoreFocus?: boolean;
};

const layerStack: string[] = [];
const inertSnapshots = new Map<HTMLElement, InertSnapshot>();
let bodyOverflowSnapshot: string | null = null;

function topLayerId() {
  return layerStack[layerStack.length - 1];
}

function rememberLayer(layerId: string) {
  const existingIndex = layerStack.indexOf(layerId);
  if (existingIndex >= 0) layerStack.splice(existingIndex, 1);
  layerStack.push(layerId);
  applyDocumentLayerState();
}

function forgetLayer(layerId: string) {
  for (let index = layerStack.length - 1; index >= 0; index -= 1) {
    if (layerStack[index] === layerId) layerStack.splice(index, 1);
  }
  applyDocumentLayerState();
}

function setElementInert(element: HTMLElement) {
  if (!inertSnapshots.has(element)) {
    inertSnapshots.set(element, {
      hadAttribute: element.hasAttribute('inert'),
      attributeValue: element.getAttribute('inert'),
      propertyValue: Boolean((element as HTMLElementWithInert).inert),
    });
  }
  element.setAttribute('inert', '');
  (element as HTMLElementWithInert).inert = true;
}

function restoreElementInert(element: HTMLElement) {
  const snapshot = inertSnapshots.get(element);
  if (!snapshot) return;

  if (element.isConnected) {
    if (snapshot.hadAttribute) {
      element.setAttribute('inert', snapshot.attributeValue ?? '');
    } else {
      element.removeAttribute('inert');
    }
    (element as HTMLElementWithInert).inert = snapshot.propertyValue;
  }

  inertSnapshots.delete(element);
}

function applyDocumentLayerState() {
  if (typeof document === 'undefined') return;

  const hasLayer = layerStack.length > 0;
  const currentTopLayerId = topLayerId();

  if (hasLayer && bodyOverflowSnapshot === null) {
    bodyOverflowSnapshot = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else if (!hasLayer && bodyOverflowSnapshot !== null) {
    document.body.style.overflow = bodyOverflowSnapshot;
    bodyOverflowSnapshot = null;
  }

  const bodyChildren = Array.from(document.body.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );

  for (const child of bodyChildren) {
    const childLayerId = child.getAttribute(LAYER_ID_ATTRIBUTE);
    const isInteractiveLayer = hasLayer && childLayerId === currentTopLayerId;
    if (hasLayer && !isInteractiveLayer) {
      setElementInert(child);
    } else {
      restoreElementInert(child);
    }
  }

  if (!hasLayer) {
    for (const element of Array.from(inertSnapshots.keys())) restoreElementInert(element);
  }
}

function isHTMLElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isDisabledControl(element: HTMLElement) {
  return (
    (element instanceof HTMLButtonElement ||
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) &&
    element.disabled
  );
}

function canReceiveFocus(element: HTMLElement | null): element is HTMLElement {
  if (!element || !element.isConnected) return false;
  if (isDisabledControl(element)) return false;
  if (element.closest('[inert]')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
  return typeof element.focus === 'function';
}

function focusElement(element: HTMLElement) {
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

export function getFocusableElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(canReceiveFocus);
}

function focusInitialElement(focusRoot: HTMLElement, initialFocusRef?: RefObject<HTMLElement | null>) {
  if (focusRoot.contains(document.activeElement) && document.activeElement !== document.body) return;

  const explicitTarget = initialFocusRef?.current;
  const target =
    explicitTarget && focusRoot.contains(explicitTarget) && canReceiveFocus(explicitTarget)
      ? explicitTarget
      : focusRoot;

  if (canReceiveFocus(target)) focusElement(target);
}

function keepTabInsideLayer(event: KeyboardEvent, focusRoot: HTMLElement) {
  const focusables = getFocusableElements(focusRoot);
  if (focusables.length === 0) {
    event.preventDefault();
    event.stopPropagation();
    focusElement(focusRoot);
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const activeElement = isHTMLElement(document.activeElement) ? document.activeElement : null;

  if (event.shiftKey && (activeElement === first || activeElement === focusRoot || !focusRoot.contains(activeElement))) {
    event.preventDefault();
    event.stopPropagation();
    focusElement(last);
    return;
  }

  if (!event.shiftKey && (activeElement === last || !focusRoot.contains(activeElement))) {
    event.preventDefault();
    event.stopPropagation();
    focusElement(first);
  }
}

export function useLayerBehavior({
  open,
  layerRootRef,
  focusRootRef,
  initialFocusRef,
  onClose,
  restoreFocus = true,
}: UseLayerBehaviorOptions) {
  const reactLayerId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const layerRoot = layerRootRef.current;
    const focusRoot = focusRootRef?.current ?? layerRoot;
    if (!layerRoot || !focusRoot) return undefined;

    const previouslyFocused = isHTMLElement(document.activeElement) ? document.activeElement : null;
    rememberLayer(reactLayerId);
    focusInitialElement(focusRoot, initialFocusRef);

    const onKeyDown = (event: KeyboardEvent) => {
      if (topLayerId() !== reactLayerId) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key === 'Tab') keepTabInsideLayer(event, focusRoot);
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      forgetLayer(reactLayerId);
      if (restoreFocus && canReceiveFocus(previouslyFocused)) focusElement(previouslyFocused);
    };
  }, [focusRootRef, initialFocusRef, layerRootRef, open, reactLayerId, restoreFocus]);

  return {
    layerId: reactLayerId,
    layerProps: {
      [LAYER_ROOT_ATTRIBUTE]: '',
      [LAYER_ID_ATTRIBUTE]: reactLayerId,
    },
  };
}
