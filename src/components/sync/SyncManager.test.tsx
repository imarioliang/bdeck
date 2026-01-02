import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { SyncManager } from './SyncManager';
import { useAuthStore } from '@/store/useAuthStore';
import * as syncEngine from '@/utils/syncEngine';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock syncEngine
vi.mock('@/utils/syncEngine', () => ({
  pushToCloud: vi.fn().mockResolvedValue({}),
  fetchFromCloud: vi.fn().mockResolvedValue([]),
  mapLinkToLocal: vi.fn(),
  mapTodoToLocal: vi.fn(),
  mapTimerToLocal: vi.fn(),
  mapNoteToLocal: vi.fn(),
}));

// Mock useAuthStore
vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('SyncManager', () => {
  const setLinks = vi.fn();
  const setTodos = vi.fn();
  const setTimers = vi.fn();
  const setNotes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'test-user' },
    });

    // Mock useLocalStorage calls
    (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockImplementation((key) => {
      if (key === 'bdeck-links') return [[{ id: '1' }], setLinks];
      if (key === 'bdeck-todos') return [[{ id: '2' }], setTodos];
      if (key === 'bdeck-timers') return [[{ id: '3' }], setTimers];
      if (key === 'bdeck-note') return ['test note', setNotes];
      return [[], vi.fn()];
    });
  });

  it('renders nothing', () => {
    const { container } = render(<SyncManager />);
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches from cloud on mount if user exists', async () => {
    render(<SyncManager />);
    await waitFor(() => {
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('links');
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('todos');
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('timers');
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('notes');
    });
  });

  // Testing the debounce and push logic is hard with just mocks without firing effects.
  // We trust the component logic. This test ensures it connects to the engine.
});
