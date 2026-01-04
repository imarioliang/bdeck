import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSkin } from './useSkin';
import { useDashboardStore } from '@/store/useDashboardStore';

// Mock the store
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

describe('useSkin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return "modern" by default', () => {
    (useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      return selector({ skin: 'modern' });
    });
    const { result } = renderHook(() => useSkin());
    expect(result.current).toBe('modern');
  });

  it('should return "retro" when set', () => {
    (useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      return selector({ skin: 'retro' });
    });
    const { result } = renderHook(() => useSkin());
    expect(result.current).toBe('retro');
  });
});
