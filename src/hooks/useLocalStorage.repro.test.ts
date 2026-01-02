import { renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useLocalStorage Hydration Mismatch Reproduction', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initialValue on first render to match server HTML, even if localStorage has data', () => {
    // Setup: localStorage has data
    window.localStorage.setItem('test-key', JSON.stringify('stored-value'));

    // Render hook
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    // Expectation (Safe Hydration): Should return 'initial-value' first
    // Current Behavior (Unsafe): Returns 'stored-value' immediately
    
    // This test SHOULD FAIL if the code is currently unsafe
    expect(result.current[0]).toBe('initial-value');
  });
});
