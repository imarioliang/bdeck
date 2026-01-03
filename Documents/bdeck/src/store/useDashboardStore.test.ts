import { describe, it, expect, beforeEach } from 'vitest';
import { useDashboardStore } from './useDashboardStore';

describe('useDashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({
      theme: 'amber',
      fontSize: 'standard',
      activeCategory: 'ALL SYSTEMS',
      syncStatus: 'idle',
    });
  });

  it('should have initial syncStatus as idle', () => {
    const state = useDashboardStore.getState();
    expect(state.syncStatus).toBe('idle');
  });

  it('should update syncStatus', () => {
    useDashboardStore.getState().setSyncStatus('syncing');
    const state = useDashboardStore.getState();
    expect(state.syncStatus).toBe('syncing');
  });

  it('should have initial skin as modern', () => {
    const state = useDashboardStore.getState();
    expect(state.skin).toBe('modern');
  });

  it('should update skin', () => {
    useDashboardStore.getState().setSkin('retro');
    const state = useDashboardStore.getState();
    expect(state.skin).toBe('retro');
  });
});