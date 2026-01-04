import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import ThemeWrapper from './ThemeWrapper';
import { useDashboardStore } from '@/store/useDashboardStore';

// Mock the store
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

describe('ThemeWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set data-skin attribute on document element', () => {
    // Mock store return values
    (useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      const state = {
        theme: 'amber',
        fontSize: 'standard',
        skin: 'retro', // We expect this to be used
      };
      return selector(state);
    });

    render(
      <ThemeWrapper>
        <div>Test Content</div>
      </ThemeWrapper>
    );

    // Assert that the data-skin attribute is set correctly
    expect(document.documentElement.getAttribute('data-skin')).toBe('retro');
  });
});