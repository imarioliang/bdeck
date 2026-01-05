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

describe('LinksPane Metadata Polish', () => {
  const mockSetIsAdding = vi.fn();
  const initialLinks = [
    { id: '1', title: 'Test Link', url: 'https://test.com', category: 'DEVELOPMENT', isPinned: false, tags: ['coding'] },
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

  it('should render the metadata footer with category shorthand and first tag', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // We expect .DEV (shorthand for DEVELOPMENT) and coding (first tag)
    expect(screen.getByText('.DEV')).toBeDefined();
    expect(screen.getByText('coding')).toBeDefined();
  });
});
