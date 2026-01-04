import { render, screen, fireEvent } from '@testing-library/react';
import { NotesPane } from './NotesPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDashboardStore } from '@/store/useDashboardStore';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

// Mock useDashboardStore
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

describe('NotesPane', () => {
  const mockSetNotes = vi.fn();

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([[
      { id: '1', content: '' }, 
      { id: '2', content: '' }, 
      { id: '3', content: '' }
    ], mockSetNotes]);
    vi.mocked(useDashboardStore).mockReturnValue({ activeNoteIndex: 0, setActiveNoteIndex: vi.fn() } as any);
    vi.clearAllMocks();
  });

  it('should render initial empty state in retro style', () => {
    render(<NotesPane />);
    expect(screen.getByPlaceholderText(/> AWAITING_LOG_01_INPUT\.\.\./i)).toBeDefined();
  });

  it('should call setNotes when typing', () => {
    render(<NotesPane />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New note content' } });
    expect(mockSetNotes).toHaveBeenCalledWith([
      { id: '1', content: 'New note content' }, 
      { id: '2', content: '' }, 
      { id: '3', content: '' }
    ]);
  });
});