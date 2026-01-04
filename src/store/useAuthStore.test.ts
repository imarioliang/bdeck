import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { Session, User } from '@supabase/supabase-js';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: null,
      user: null,
      authModalOpen: false,
    });
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.authModalOpen).toBe(false);
  });

  it('should set auth modal open', () => {
    useAuthStore.getState().setAuthModalOpen(true);
    expect(useAuthStore.getState().authModalOpen).toBe(true);
  });

  it('should set session and user', () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' } as User;
    const mockSession = { user: mockUser, access_token: 'token' } as Session;

    useAuthStore.getState().setSession(mockSession);
    
    const state = useAuthStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockUser);
  });
  
  it('should clear session', () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' } as User;
    const mockSession = { user: mockUser, access_token: 'token' } as Session;

    useAuthStore.getState().setSession(mockSession);
    useAuthStore.getState().setSession(null);

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });
});
