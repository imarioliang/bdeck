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

describe('LinksPane Action Enhancement', () => {
  const mockSetIsAdding = vi.fn();
  const initialLinks = [
    { id: '1', title: 'Test Link', url: 'https://test.com', category: 'SYSTEM', isPinned: false, tags: [] },
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

  it('should have horizontal spacing classes for buttons in the center overlay', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const actionContainer = screen.getByText('[P]').parentElement;
    // Expect some gap or justify-around/between
    expect(actionContainer?.className).toMatch(/gap-[4-8]|justify-(around|between|evenly)/);
  });

  it('should have pulse animation classes on hover for action buttons', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const pinButton = screen.getByText('[P]');
    expect(pinButton.className).toContain('hover:animate-pulse');
  });
});
