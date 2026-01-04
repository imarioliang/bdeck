import { render, screen, fireEvent } from '@testing-library/react';
import { NotesPane } from './NotesPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { useDashboardStore } from '@/store/useDashboardStore';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

// Mock useDashboardStore
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

describe('NotesPane', () => {
  const mockSetNotes = vi.fn();

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([['', '', ''], mockSetNotes]);
    vi.mocked(useSkin).mockReturnValue('modern');
    vi.mocked(useDashboardStore).mockReturnValue({ activeNoteIndex: 0, setActiveNoteIndex: vi.fn() } as any);
    vi.clearAllMocks();
  });

  it('should render initial empty state', () => {
    render(<NotesPane />);
    expect(screen.getByPlaceholderText(/> AWAITING LOG_01 SYSTEM LOG INPUT.../i)).toBeDefined();
  });

  it('should render retro style when skin is retro', () => {
    vi.mocked(useSkin).mockReturnValue('retro');
    render(<NotesPane />);
    expect(screen.getByPlaceholderText(/> AWAITING_LOG_01_INPUT.../i)).toBeDefined();
  });

  it('should call setNotes when typing', () => {
    render(<NotesPane />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New note content' } });
    expect(mockSetNotes).toHaveBeenCalled();
  });
});
