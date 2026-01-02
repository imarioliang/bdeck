import { render, screen, fireEvent, act } from '@testing-library/react';
import { TodoPane } from './TodoPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('TodoPane', () => {
  const mockSetTodos = vi.fn();
  const initialTodos = [
    { id: '1', text: 'Task 1', done: false, level: 0 },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialTodos, mockSetTodos]);
    vi.clearAllMocks();
  });

  it('should render initial todos', () => {
    render(<TodoPane />);
    expect(screen.getByDisplayValue('Task 1')).toBeDefined();
  });

  it('should call setTodos when adding a new todo via button', () => {
    render(<TodoPane />);
    const addButton = screen.getByText(/List item/i);

    fireEvent.click(addButton);

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('should call setTodos when toggling a todo', () => {
    render(<TodoPane />);
    const toggleButton = screen.getByLabelText(/mark as done/i);
    
    fireEvent.click(toggleButton);

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('should call setTodos when deleting a todo', () => {
    render(<TodoPane />);
    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);
    expect(mockSetTodos).toHaveBeenCalled();
  });
});
