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

  it('should render theme selection buttons', () => {
    render(<CustomizationMenu isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/THEME/i)).toBeDefined();
    expect(screen.getByText('Amber')).toBeDefined();
    expect(screen.getByText('Green')).toBeDefined();
    expect(screen.getByText('Blue')).toBeDefined();
  });

  it('should call setTheme when a theme button is clicked', () => {
    render(<CustomizationMenu isOpen={true} onClose={vi.fn()} />);
    const greenButton = screen.getByText('Green');
    fireEvent.click(greenButton);
    expect(mockSetTheme).toHaveBeenCalledWith('green');
  });
});
