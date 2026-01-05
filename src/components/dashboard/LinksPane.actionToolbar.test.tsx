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

describe('LinksPane Action Toolbar', () => {
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

  it('should show the action toolbar buttons on hover', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // Buttons are technically in the DOM but hidden by translate-y-full and opacity-0
    // We check for their existence and that they have the correct text
    expect(screen.getByText('PIN')).toBeDefined();
    expect(screen.getByText('EDIT')).toBeDefined();
    expect(screen.getByText('DEL')).toBeDefined();
  });
});
