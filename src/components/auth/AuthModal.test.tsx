import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthModal } from './AuthModal';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/utils/supabaseClient';

// Mock Supabase client
vi.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

// Mock useAuthStore
vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('AuthModal', () => {
  const setAuthModalOpen = vi.fn();
  const setSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      authModalOpen: true,
      setAuthModalOpen,
      setSession,
    });
  });

  it('renders nothing when not open', () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      authModalOpen: false,
      setAuthModalOpen,
    });
    const { container } = render(<AuthModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders login form by default', () => {
    render(<AuthModal />);
    expect(screen.getByText('[ AUTH_GATE ]')).toBeInTheDocument();
    expect(screen.getByText('USER_LOGIN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('OPERATOR_ID (EMAIL)...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ACCESS_CODE (PASSWORD)...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'INITIATE SESSION' })).toBeInTheDocument();
  });

  it('toggles to sign up mode', () => {
    render(<AuthModal />);
    const toggleBtn = screen.getByText('Create New Identity');
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: 'ESTABLISH IDENTITY' })).toBeInTheDocument();
  });

  it('calls signInWithPassword on login submit', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({ data: { session: {} }, error: null });
    
    render(<AuthModal />);
    
    fireEvent.change(screen.getByPlaceholderText('OPERATOR_ID (EMAIL)...'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('ACCESS_CODE (PASSWORD)...'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'INITIATE SESSION' }));
    
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('calls signUp on register submit', async () => {
    (supabase.auth.signUp as any).mockResolvedValue({ data: { session: {} }, error: null });
    
    render(<AuthModal />);
    fireEvent.click(screen.getByText('Create New Identity'));
    
    fireEvent.change(screen.getByPlaceholderText('OPERATOR_ID (EMAIL)...'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('ACCESS_CODE (PASSWORD)...'), { target: { value: 'newpass123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'ESTABLISH IDENTITY' }));
    
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'newpass123',
    });
  });
});
