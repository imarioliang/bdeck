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

  it('should have initial viewMode as list', () => {
    const state = useDashboardStore.getState();
    expect(state.viewMode).toBe('list');
  });

  it('should update viewMode', () => {
    useDashboardStore.getState().setViewMode('grid');
    const state = useDashboardStore.getState();
    expect(state.viewMode).toBe('grid');
  });
});