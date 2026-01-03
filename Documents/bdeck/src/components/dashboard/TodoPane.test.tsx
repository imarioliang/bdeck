import { render, screen, fireEvent, act } from '@testing-library/react';
import { TodoPane } from './TodoPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('TodoPane', () => {
  const mockSetTodos = vi.fn();
  const initialTodos = [
    { id: '1', text: 'Task 1', done: false, level: 0 },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialTodos, mockSetTodos]);
    vi.mocked(useSkin).mockReturnValue('modern');
    vi.clearAllMocks();
  });

  it('should render initial todos', () => {
    render(<TodoPane />);
    expect(screen.getByDisplayValue('Task 1')).toBeDefined();
  });

  it('should render retro style when skin is retro', () => {
    vi.mocked(useSkin).mockReturnValue('retro');
    render(<TodoPane />);
    
    // Check for retro input placeholder
    expect(screen.getByPlaceholderText('ADD_OBJECTIVE...')).toBeDefined();
    // Check for [ENT] indicator
    expect(screen.getByText('[ENT]')).toBeDefined();
    // Check for retro checkbox style
    expect(screen.getByText('[ ]')).toBeDefined();
    expect(screen.getByText('::')).toBeDefined(); // Grip handle
  });

  it('should call setTodos when adding a new todo via input bar', () => {
    render(<TodoPane />);
    const input = screen.getByPlaceholderText(/NEW MISSION OBJECTIVE/i);

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('should call setTodos when toggling a todo', () => {
    render(<TodoPane />);
    const toggleButton = screen.getByTitle(/Mark as done/i);
    
    fireEvent.click(toggleButton);

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('should call setTodos when deleting a todo', () => {
    render(<TodoPane />);
    const deleteButton = screen.getByTitle(/Delete/i);
    fireEvent.click(deleteButton);
    expect(mockSetTodos).toHaveBeenCalled();
  });
});
