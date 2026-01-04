import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { SyncManager } from './SyncManager';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import * as syncEngine from '@/utils/syncEngine';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock syncEngine
vi.mock('@/utils/syncEngine', () => ({
  pushToCloud: vi.fn().mockResolvedValue({ error: null }),
  fetchFromCloud: vi.fn().mockResolvedValue({ data: [], error: null }),
  mapLinkToLocal: vi.fn(),
  mapTodoToLocal: vi.fn(),
  mapTimerToLocal: vi.fn(),
  mapNoteToLocal: vi.fn(),
}));

// Mock supabaseClient
vi.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

// Mock useAuthStore
vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock useDashboardStore
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
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
  const setSession = vi.fn();
  const setSyncStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'test-user' },
      setSession,
    });

    (useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setSyncStatus,
    });


  });

  it('renders nothing', () => {
    const setLinks = vi.fn();
    const setTodos = vi.fn();
    const setTimers = vi.fn();
    const setNotes = vi.fn();

    (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockImplementation((key) => {
      if (key === 'bdeck-links') return [[], setLinks];
      if (key === 'bdeck-todos') return [[], setTodos];
      if (key === 'bdeck-timers') return [[], setTimers];
      if (key === 'bdeck-notes-multi') return [[{ id: 'log-01', content: '' }, { id: 'log-02', content: '' }, { id: 'log-03', content: '' }], setNotes];
      return [[], vi.fn()];
    });

    const { container } = render(<SyncManager />);
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches from cloud on mount if user exists', async () => {
    const setLinks = vi.fn();
    const setTodos = vi.fn();
    const setTimers = vi.fn();
    const setNotes = vi.fn();

    (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockImplementation((key) => {
      if (key === 'bdeck-links') return [[], setLinks];
      if (key === 'bdeck-todos') return [[], setTodos];
      if (key === 'bdeck-timers') return [[], setTimers];
      if (key === 'bdeck-notes-multi') return [[{ id: 'log-01', content: '' }, { id: 'log-02', content: '' }, { id: 'log-03', content: '' }], setNotes];
      return [[], vi.fn()];
    });

    render(<SyncManager />);
    await waitFor(() => {
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('links');
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('todos');
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('timers');
      expect(syncEngine.fetchFromCloud).toHaveBeenCalledWith('notes');
    });
  });

  it('should push local data to cloud even if cloud data exists (Merge on Login)', async () => {
    const setLinks = vi.fn();
    const setTodos = vi.fn();
    const setTimers = vi.fn();
    const setNotes = vi.fn();

    const localLinks = [{ id: 'local-1', title: 'Local Link' }];
    const localTodos = [{ id: 'local-todo-1', title: 'Local Todo' }];
    const localTimers = [{ id: 'local-timer-1', name: 'Local Timer' }];
    const localNotes = [{ id: 'log-01', content: 'test note for sync' }, { id: 'log-02', content: '' }, { id: 'log-03', content: '' }];

    (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockImplementation((key) => {
      // console.log(`useLocalStorage mock called for key: ${key}`);
      if (key === 'bdeck-links') return [localLinks, setLinks];
      if (key === 'bdeck-todos') return [localTodos, setTodos];
      if (key === 'bdeck-timers') return [localTimers, setTimers];
      if (key === 'bdeck-notes-multi') return [localNotes, setNotes];
      if (key === 'bdeck-last-user-id') return [null, vi.fn()];
      return [[], vi.fn()];
    });

    // 2. Setup: Cloud data also exists
    const cloudLinks = [{ id: 'cloud-1', title: 'Cloud Link' }];
    (syncEngine.fetchFromCloud as any).mockImplementation((table: string) => {
        if (table === 'links') return Promise.resolve({ data: cloudLinks, error: null });
        return Promise.resolve({ data: [], error: null });
    });

    render(<SyncManager />);

    // 3. Verification: pushToCloud should be called with local data
    await waitFor(() => {
        expect(syncEngine.pushToCloud).toHaveBeenCalledWith('links', localLinks);
        expect(syncEngine.pushToCloud).toHaveBeenCalledWith('todos', localTodos);
        expect(syncEngine.pushToCloud).toHaveBeenCalledWith('timers', localTimers);
        expect(syncEngine.pushToCloud).toHaveBeenCalledWith('notes', localNotes);
    });
  });

  it('should NOT push local data if switching users (Wipe on Switch)', async () => {
    const setLinks = vi.fn();
    const setTodos = vi.fn();
    const setTimers = vi.fn();
    const setNotes = vi.fn();

    // 1. Setup: Local data exists (from previous user)
    const localLinks = [{ id: 'prev-user-link', title: 'Prev User Link' }];
    const localTodos = [{ id: 'prev-user-todo', title: 'Prev User Todo' }];
    const localTimers = [{ id: 'prev-user-timer', name: 'Prev User Timer' }];
    const localNotes = [{ id: 'log-01', content: 'prev user note' }, { id: 'log-02', content: '' }, { id: 'log-03', content: '' }];

    (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockImplementation((key) => {
      if (key === 'bdeck-links') return [localLinks, setLinks];
      if (key === 'bdeck-todos') return [localTodos, setTodos];
      if (key === 'bdeck-timers') return [localTimers, setTimers];
      if (key === 'bdeck-notes-multi') return [localNotes, setNotes];
      if (key === 'bdeck-last-user-id') return ['previous-user-id', vi.fn()]; // Different user
      return [[], vi.fn()];
    });

    // 2. Setup: Cloud data is empty for new user
    (syncEngine.fetchFromCloud as any).mockResolvedValue({ data: [], error: null });

    render(<SyncManager />);

    // 3. Verification: pushToCloud should NOT be called with local data
    await waitFor(() => {
        expect(syncEngine.fetchFromCloud).toHaveBeenCalled();
        // Assert that pushToCloud is NOT called with any of the previous user's data
        expect(syncEngine.pushToCloud).not.toHaveBeenCalledWith('links', localLinks);
        expect(syncEngine.pushToCloud).not.toHaveBeenCalledWith('todos', localTodos);
        expect(syncEngine.pushToCloud).not.toHaveBeenCalledWith('timers', localTimers);
        expect(syncEngine.pushToCloud).not.toHaveBeenCalledWith('notes', localNotes);

        // Assert that all local data is wiped (set to empty array)
        expect(setLinks).toHaveBeenCalledWith([]);
        expect(setTodos).toHaveBeenCalledWith([]);
        expect(setTimers).toHaveBeenCalledWith([]);
        expect(setNotes).toHaveBeenCalledWith([]);
    });
  });
});
