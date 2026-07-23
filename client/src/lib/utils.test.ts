import { describe, it, expect } from 'vitest';
import { safeHttpUrl } from './utils';

describe('safeHttpUrl', () => {
  it('allows only HTTPS editorial links', () => {
    expect(safeHttpUrl('https://example.com')).toBe('https://example.com');
    expect(safeHttpUrl('http://example.com/path')).toBeUndefined();
    expect(safeHttpUrl('mailto:hello@example.com')).toBeUndefined();
    expect(safeHttpUrl('/internal/path')).toBeUndefined();
  });

  it('rejects dangerous schemes', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(safeHttpUrl('vbscript:msgbox(1)')).toBeUndefined();
  });

  it('rejects empty or missing values', () => {
    expect(safeHttpUrl('')).toBeUndefined();
    expect(safeHttpUrl(undefined)).toBeUndefined();
    expect(safeHttpUrl(null)).toBeUndefined();
  });
});
