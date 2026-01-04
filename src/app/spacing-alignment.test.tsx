import { render, screen } from '@testing-library/react';
import Home from './page';
import { Pane } from '@/components/dashboard/Pane';
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

describe('Spacing & Alignment', () => {
  beforeEach(() => {
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.mocked(useDashboardStore).mockReturnValue({
      activeCategory: 'ALL SYSTEMS',
      setActiveCategory: vi.fn(),
    } as any);
    vi.clearAllMocks();
  });

  it('dashboard main container should have standardized spacing', () => {
    const { container } = render(<Home />);
    
    // Check main vertical spacing
    const mainContainer = container.querySelector('.max-w-\\[1400px\\]');
    expect(mainContainer?.className).toContain('space-y-6');
    
    // Check bottom grid gap
    const bottomGrid = container.querySelector('.lg\\:grid-cols-12');
    expect(bottomGrid?.className).toContain('gap-6');
  });

  it('panes should have standardized internal padding in retro mode', () => {
    vi.mocked(useSkin).mockReturnValue('retro');
    render(<Pane title="Test" label="TEST"><div>Content</div></Pane>);
    const contentContainer = screen.getByText('Content').parentElement;
    expect(contentContainer?.className).toContain('px-3');
    expect(contentContainer?.className).toContain('pb-3');
  });
});
