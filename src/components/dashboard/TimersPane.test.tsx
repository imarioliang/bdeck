import { render, screen, fireEvent } from '@testing-library/react';
import { TimersPane } from './TimersPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('TimersPane', () => {
  const mockSetProjects = vi.fn();
  const initialProjects = [
    { id: '1', name: 'Project 1', time: 0, isActive: false },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialProjects, mockSetProjects]);
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render initial projects', () => {
    render(<TimersPane />);
    expect(screen.getByText('Project 1')).toBeDefined();
    expect(screen.getByText('00:00:00')).toBeDefined();
  });

  it('should call setProjects when adding a new project', () => {
    render(<TimersPane />);
    
    const input = screen.getByPlaceholderText('New project name...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Project 2' } });
    fireEvent.click(addButton);

    expect(mockSetProjects).toHaveBeenCalled();
  });

  it('should call setProjects when deleting a project', () => {
    render(<TimersPane />);
    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);
    expect(mockSetProjects).toHaveBeenCalled();
  });
});