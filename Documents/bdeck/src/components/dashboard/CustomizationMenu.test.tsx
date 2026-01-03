import { render, screen, fireEvent } from '@testing-library/react';
import { CustomizationMenu } from './CustomizationMenu';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { vi } from 'vitest';

// Mock stores
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

describe('CustomizationMenu', () => {
  const mockSetSkin = vi.fn();
  const mockSetTheme = vi.fn();
  const mockSetFontSize = vi.fn();

  beforeEach(() => {
    (useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: 'amber',
      fontSize: 'standard',
      skin: 'modern',
      setTheme: mockSetTheme,
      setFontSize: mockSetFontSize,
      setSkin: mockSetSkin,
      resetAllData: vi.fn(),
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      setAuthModalOpen: vi.fn(),
    });
    vi.clearAllMocks();
  });

  it('should render skin selection buttons', () => {
    render(<CustomizationMenu isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Interface Skin/i)).toBeDefined();
    expect(screen.getByText('Modern')).toBeDefined();
    expect(screen.getByText('Retro')).toBeDefined();
  });

  it('should call setSkin when a skin button is clicked', () => {
    render(<CustomizationMenu isOpen={true} onClose={vi.fn()} />);
    const retroButton = screen.getByText('Retro');
    fireEvent.click(retroButton);
    expect(mockSetSkin).toHaveBeenCalledWith('retro');
  });
});
