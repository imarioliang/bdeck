import { render, screen } from '@testing-library/react';
import Home from './page';
import { useSkin } from '@/hooks/useSkin';
import { useDashboardStore } from '@/store/useDashboardStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the hooks
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

vi.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

// Mock components that might cause issues in a base Home test
vi.mock('@/components/dashboard/AsciiLogo', () => ({
  AsciiLogo: () => <div data-testid="ascii-logo">LOGO</div>,
}));

describe('Header Restructuring', () => {
  beforeEach(() => {
    vi.mocked(useDashboardStore).mockReturnValue({
      activeCategory: 'ALL SYSTEMS',
      setActiveCategory: vi.fn(),
    } as any);
  });

  it('should render two header rows in retro mode', () => {
    vi.mocked(useSkin).mockReturnValue('retro');
    render(<Home />);
    
    // Check for System Bar (Row 1)
    expect(screen.getByText(/\[ COMMAND_CENTER \]/i)).toBeDefined();
    
    // There might be multiple MENU buttons, get the one in the header (System Bar)
    const menuButtons = screen.getAllByText(/MENU/i);
    expect(menuButtons.length).toBeGreaterThan(0);
    
    // Check for Path Bar (Row 2)
    expect(screen.getByText(/PATH:/i)).toBeDefined();
  });
});