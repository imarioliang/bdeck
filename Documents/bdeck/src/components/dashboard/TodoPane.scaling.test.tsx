import { render, screen } from '@testing-library/react';
import { TodoPane } from './TodoPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('TodoPane Retro Scaling', () => {
  const mockSetTodos = vi.fn();
  const initialTodos = [{ id: '1', text: 'BIG TASK', done: false, level: 0 }];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialTodos, mockSetTodos]);
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.clearAllMocks();
  });

  it('todo items should have larger font size in retro mode', () => {
    render(<TodoPane />);
    
    const taskInput = screen.getByDisplayValue('BIG TASK');
    // We expect text-base or larger (currently it is text-sm or similar)
    expect(taskInput.className).toContain('text-base');
  });

  it('drag handles should be larger in retro mode', () => {
    render(<TodoPane />);
    
    const handle = screen.getByText('::');
    expect(handle.className).toContain('text-base');
  });
});
