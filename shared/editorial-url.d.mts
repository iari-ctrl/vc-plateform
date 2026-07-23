export interface EditorialUrlOptions {
  allowInternal?: boolean;
  allowFragment?: boolean;
}

export function safeEditorialUrl(
  value?: string | null,
  options?: EditorialUrlOptions,
): string | undefined;

export function isSafeEditorialUrl(
  value?: string | null,
  options?: EditorialUrlOptions,
): boolean;
