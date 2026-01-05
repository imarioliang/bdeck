import { render, screen } from '@testing-library/react';
import { LinksPane } from './LinksPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDashboardStore } from '@/store/useDashboardStore';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

vi.mock('@/store/useDashboardStore', () => ({
  useDashboardStore: vi.fn(),
}));

describe('LinksPane Grid Refinement', () => {
  const mockSetIsAdding = vi.fn();
  const initialLinks = [
    { id: '1', title: 'Test Link', url: 'https://test.com', category: 'SYSTEM', isPinned: true, tags: ['tag1'] },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, vi.fn()]);
    vi.mocked(useDashboardStore).mockReturnValue({
      viewMode: 'grid',
      setViewMode: vi.fn(),
      activeTag: null,
    } as any);
    vi.clearAllMocks();
  });

  it('should render grid items with a structured Header, Body, and Footer', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // Check for grid tile container
    const gridItem = screen.getByText('Test Link').closest('.group');
    expect(gridItem).toBeDefined();

    // Check for Header (Pinned indicator - assuming we use a specific class or icon)
    // In our spec, we said Header (Pinned indicator)
    const pinnedIcon = gridItem?.querySelector('.lucide-pin');
    expect(pinnedIcon).toBeDefined();

    // Check for Body (Icon & Title)
    expect(screen.getByText('Test Link')).toBeDefined();

    // Check for Footer (Metadata: .EXT and first tag)
    expect(screen.getByText('.SYS')).toBeDefined();
    expect(screen.getByText('tag1')).toBeDefined();
  });
});
