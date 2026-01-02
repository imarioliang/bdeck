import { renderHook, act } from '@testing-library/react';
import { useDashboardStore } from './useDashboardStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useDashboardStore Hydration Mismatch Reproduction', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store state
    act(() => {
      useDashboardStore.setState({
        theme: 'amber',
        fontSize: 'standard',
        activeCategory: 'ALL SYSTEMS'
      });
    });
  });

  it('should initialize with default state to match server, but currently loads from storage immediately', () => {
    // Manually set localStorage
    const storedState = {
      state: {
        theme: 'green',
        fontSize: 'large',
        activeCategory: 'DEVELOPMENT'
      },
      version: 0
    };
    localStorage.setItem('bdeck-dashboard-storage', JSON.stringify(storedState));

    // Force rehydration (Zustand persist has rehydrate method usually, or we just rely on the hook reading it)
    // Since it's a singleton created at module scope, it might have already read localStorage when the file was imported.
    // We can try to force it to read again.
    
    const { result } = renderHook(() => useDashboardStore());
    
    // We want to force rehydration from the new localStorage value
    act(() => {
        useDashboardStore.persist.rehydrate();
    });

    // If it is unsafe, it will be 'green' (stored value) immediately or after rehydrate.
    // For SAFE hydration, we want the INITIAL render to be 'amber' (default).
    // But since this is a unit test of the store hook, it's slightly different from a component render.
    
    // However, if the store allows synchronous reading from localStorage, it returns 'green'.
    // If we want to assert "Safe Hydration", we want the first render to match Server (default).
    // But the store itself doesn't know about Server/Client. The COMPONENT usage is what matters.
    
    // So testing the store *hook* directly might be misleading.
    // The issue is: `useDashboardStore()` in a component returns the current state.
    // If the state was updated from localStorage *before* the component rendered, the component renders 'green'.
    // The Server rendered 'amber'. Mismatch.
    
    // So the test should simply verify that the store DOES load from localStorage.
    // If it does, we confirm the risk.
    
    expect(result.current.theme).toBe('green');
  });
});
