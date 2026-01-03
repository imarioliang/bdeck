import { render, screen, fireEvent } from '@testing-library/react';
import { TimersPane } from './TimersPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key, initial) => [initial, vi.fn()]),
}));

describe('TimersPane', () => {
  const mockSetProjects = vi.fn();
  const mockSetIsAdding = vi.fn();
  const mockSetRestMode = vi.fn();
  const mockSetRestTime = vi.fn();
  
  const initialProjects = [
    { id: '1', name: 'Project 1', time: 0, isActive: false },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockImplementation((key, initial) => {
      if (key === 'bdeck-timers') return [initialProjects, mockSetProjects];
      if (key === 'bdeck-rest-mode') return [false, mockSetRestMode];
      if (key === 'bdeck-rest-time') return [0, mockSetRestTime];
      return [initial, vi.fn()];
    });
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render initial projects', () => {
    render(<TimersPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    expect(screen.getByText(/Project 1/i)).toBeDefined();
    expect(screen.getByText('00:00:00')).toBeDefined();
  });

  it('should call setProjects when adding a new project', () => {
    const { rerender } = render(<TimersPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    
    rerender(<TimersPane isAdding={true} setIsAdding={mockSetIsAdding} />);

    const input = screen.getByPlaceholderText(/PROJECT_ID/i);
    const saveButton = screen.getByText(/Execute/i);

    fireEvent.change(input, { target: { value: 'Project 2' } });
    fireEvent.click(saveButton);

    expect(mockSetProjects).toHaveBeenCalled();
    expect(mockSetIsAdding).toHaveBeenCalledWith(false);
  });

  it('should call setProjects when deleting a project', () => {
    render(<TimersPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    const deleteButton = screen.getByTitle(/Delete/i);
    fireEvent.click(deleteButton);
    expect(mockSetProjects).toHaveBeenCalled();
  });

  it('should toggle rest mode when clicking the REST TIMER button', () => {
    render(<TimersPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    const restButton = screen.getByRole('button', { name: /REST TIMER/i });
    fireEvent.click(restButton);
    expect(mockSetRestMode).toHaveBeenCalled();
  });
});
