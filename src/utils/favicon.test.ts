import { describe, it, expect } from 'vitest';
import { getFaviconUrl } from './favicon';

describe('getFaviconUrl', () => {
  it('should return a valid Google S2 URL for a given domain', () => {
    const url = 'https://github.com';
    const faviconUrl = getFaviconUrl(url);
    expect(faviconUrl).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=64');
  });

  it('should support custom sizes', () => {
    const url = 'https://google.com';
    const faviconUrl = getFaviconUrl(url, 128);
    expect(faviconUrl).toBe('https://www.google.com/s2/favicons?domain=google.com&sz=128');
  });

  it('should return null for invalid URLs', () => {
    expect(getFaviconUrl('not-a-url')).toBeNull();
  });
});
