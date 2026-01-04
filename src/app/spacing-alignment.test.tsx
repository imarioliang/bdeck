import { render, screen } from '@testing-library/react';
import Home from './page';
import { Pane } from '@/components/dashboard/Pane';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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
    vi.mocked(useDashboardStore).mockReturnValue({
      activeCategory: 'ALL SYSTEMS',
      setActiveCategory: vi.fn(),
    } as any);
    vi.clearAllMocks();
  });

  it('dashboard main container should have standardized spacing', () => {
    const { container } = render(<Home />);
    
    // Find the main container div by looking for the space-y-6 class
    const mainContainer = container.querySelector('.space-y-6');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-[1400px]');
  });

  it('panes should have standardized internal padding', () => {
    render(<Pane title="Test" label="TEST"><div>Content</div></Pane>);
    const contentContainer = screen.getByText('Content').parentElement;
    expect(contentContainer?.className).toContain('px-3');
    expect(contentContainer?.className).toContain('pb-3');
  });
});
