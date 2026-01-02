import { describe, it, expect, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'example-anon-key');

// Mock createClient
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('supabaseClient', () => {
  it('should initialize supabase client with environment variables', async () => {
    // Import the client (which triggers initialization)
    await import('./supabaseClient');

    expect(createClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'example-anon-key'
    );
  });
});
