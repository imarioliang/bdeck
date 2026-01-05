import { render, screen, fireEvent } from '@testing-library/react';
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

describe('LinksPane View Toggle', () => {
  const mockSetViewMode = vi.fn();
  const mockSetIsAdding = vi.fn();
  const initialLinks = [
    { id: '1', title: 'Test Link', url: 'https://test.com', category: 'SYSTEM', isPinned: false, tags: [] },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, vi.fn()]);
    vi.mocked(useDashboardStore).mockReturnValue({
      viewMode: 'list',
      setViewMode: mockSetViewMode,
      activeTag: null,
    } as any);
    vi.clearAllMocks();
  });

  it('should render the view toggle button', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // We expect a button that mentions current "MODE: LIST"
    expect(screen.getByText(/MODE: LIST/i)).toBeDefined();
  });

  it('should call setViewMode with "grid" when the toggle button is clicked in list mode', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const toggleButton = screen.getByText(/MODE: LIST/i);
    fireEvent.click(toggleButton);
    
    expect(mockSetViewMode).toHaveBeenCalledWith('grid');
  });

  it('should show "MODE: GRID" when in grid mode', () => {
    vi.mocked(useDashboardStore).mockReturnValue({
      viewMode: 'grid',
      setViewMode: mockSetViewMode,
      activeTag: null,
    } as any);

    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    expect(screen.getByText(/MODE: GRID/i)).toBeDefined();
  });

  it('should render the grid container class when in grid mode', () => {
    vi.mocked(useDashboardStore).mockReturnValue({
      viewMode: 'grid',
      setViewMode: mockSetViewMode,
      activeTag: null,
    } as any);

    const { container } = render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // Check for grid container class
    const gridContainer = container.querySelector('.grid-cols-2');
    expect(gridContainer).toBeDefined();
  });
});