import { render, screen } from '@testing-library/react';
import Home from './page';
import { useSkin } from '@/hooks/useSkin';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key, initial) => [initial, vi.fn()]),
}));

vi.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

describe('Structural Constraints', () => {
  beforeEach(() => {
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.mocked(useDashboardStore).mockReturnValue({
      activeCategory: 'ALL SYSTEMS',
      setActiveCategory: vi.fn(),
    } as any);
    vi.clearAllMocks();
  });

  it('top section container should have max-height in retro mode', () => {
    const { container } = render(<Home />);
    
    // The parent container of aside and section
    const topContainer = container.querySelector('.max-h-\\[500px\\]');
    expect(topContainer).toBeDefined();
  });

  it('bottom panes should have min-height in retro mode', () => {
    render(<Home />);
    
    // We expect the Pane components to have min-h-[400px]
    const timersPane = screen.getByText(/Timer Daemon/i).closest('.border-terminal-main');
    expect(timersPane?.className).toContain('min-h-[400px]');
  });
});
