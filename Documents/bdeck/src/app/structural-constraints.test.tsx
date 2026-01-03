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

  it('top section should have max-height and overflow-auto classes in retro mode', () => {
    render(<Home />);
    
    // The Apps Grid section should have the max-h-[500px] class
    const appsGrid = screen.getByRole('region', { name: /apps grid/i });
    expect(appsGrid.className).toContain('max-h-[500px]');
    expect(appsGrid.className).toContain('overflow-y-auto');
  });

  it('sidebar should have max-height and overflow-auto in retro mode', () => {
    render(<Home />);
    
    // Aside container for sidebar
    const aside = screen.getByRole('complementary');
    expect(aside.className).toContain('max-h-[500px]');
    expect(aside.className).toContain('overflow-y-auto');
  });

  it('bottom panes should have min-height in retro mode', () => {
    render(<Home />);
    
    // We expect the Pane components to have min-h-[400px]
    // Let's check the container of one of the panes
    const timersPane = screen.getByText(/Timer Daemon/i).closest('.border-terminal-main');
    expect(timersPane?.className).toContain('min-h-[400px]');
  });
});
