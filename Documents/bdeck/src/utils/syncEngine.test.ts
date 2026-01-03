import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pushToCloud, fetchFromCloud } from './syncEngine';
import { supabase } from './supabaseClient';
import { useAuthStore } from '@/store/useAuthStore';

// Mock Supabase
vi.mock('./supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock Auth Store
vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

describe('syncEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pushToCloud should not sync if no user', async () => {
    (useAuthStore.getState as any).mockReturnValue({ user: null });
    const { error } = await pushToCloud('links', []);
    expect(error).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('pushToCloud should upsert data', async () => {
    (useAuthStore.getState as any).mockReturnValue({ user: { id: 'user-1' } });
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ upsert: mockUpsert });

    const data = [{ id: '1', title: 'Test' }];
    const { error } = await pushToCloud('links', data);

    expect(error).toBeNull();
    expect(supabase.from).toHaveBeenCalledWith('links');
    expect(mockUpsert).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: '1', user_id: 'user-1' })])
    );
  });

  it('fetchFromCloud should select data', async () => {
    (useAuthStore.getState as any).mockReturnValue({ user: { id: 'user-1' } });
    const mockEq = vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    const { data, error } = await fetchFromCloud('links');

    expect(error).toBeNull();
    expect(supabase.from).toHaveBeenCalledWith('links');
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(data).toEqual([{ id: '1' }]);
  });
});