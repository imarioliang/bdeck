import { render, screen } from '@testing-library/react';
import { TimersPane } from './TimersPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key, initial) => [initial, vi.fn()]),
}));

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('TimersPane Retro Mode', () => {
  const initialProjects = [
    { id: '1', name: 'Project 1', time: 0, isActive: false },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockImplementation((key, initial) => {
      if (key === 'bdeck-timers') return [initialProjects, vi.fn()];
      return [initial, vi.fn()];
    });
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.clearAllMocks();
  });

  it('should render condensed status indicators [P] or [R]', () => {
    render(<TimersPane isAdding={false} setIsAdding={vi.fn()} />);
    
    // Check for [P] (Paused) indicator
    expect(screen.getByText('[P]')).toBeDefined();
  });

  it('should render the [ INIT_NEW_TIMER ] button', () => {
    render(<TimersPane isAdding={false} setIsAdding={vi.fn()} />);
    
    expect(screen.getByText('[ INIT_NEW_TIMER ]')).toBeDefined();
  });
});
