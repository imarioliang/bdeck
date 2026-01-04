import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeaderIndicators } from './HeaderIndicators';
import { useDashboardStore } from '@/store/useDashboardStore';

// Mock useDashboardStore
vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

describe('HeaderIndicators', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sync ok when idle', () => {
    (useDashboardStore as any).mockReturnValue({ syncStatus: 'idle' });
    render(<HeaderIndicators />);
    expect(screen.getByText('Sync_Ok')).toBeInTheDocument();
  });

  it('should render transmitting when syncing', () => {
    (useDashboardStore as any).mockReturnValue({ syncStatus: 'syncing' });
    render(<HeaderIndicators />);
    expect(screen.getByText('Transmitting...')).toBeInTheDocument();
  });

  it('should render sync err when error', () => {
    (useDashboardStore as any).mockReturnValue({ syncStatus: 'error' });
    render(<HeaderIndicators />);
    expect(screen.getByText('Sync_Err')).toBeInTheDocument();
  });
});
