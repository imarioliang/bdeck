import { render, screen, fireEvent } from '@testing-library/react';
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
    { text: 'Task 1', done: false },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialTodos, mockSetTodos]);
    vi.clearAllMocks();
  });

  it('should render initial todos', () => {
    render(<TodoPane />);
    expect(screen.getByText('Task 1')).toBeDefined();
  });

  it('should call setTodos when adding a new todo', () => {
    render(<TodoPane />);
    const input = screen.getByPlaceholderText('Add task...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(mockSetTodos).toHaveBeenCalledWith([
      ...initialTodos,
      { text: 'New Task', done: false },
    ]);
  });

  it('should call setTodos when toggling a todo', () => {
    render(<TodoPane />);
    const todoItem = screen.getByText('Task 1');
    
    fireEvent.click(todoItem);

    expect(mockSetTodos).toHaveBeenCalledWith([
      { text: 'Task 1', done: true },
    ]);
  });
});
