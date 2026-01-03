import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  authModalOpen: boolean;
  setSession: (session: Session | null) => void;
  setAuthModalOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  authModalOpen: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setAuthModalOpen: (authModalOpen) => set({ authModalOpen }),
}));
