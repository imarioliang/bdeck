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

describe('LinksPane Visual Scaling', () => {
  const initialLinks = [
    { id: '1', title: 'BIG TEXT LINK', url: 'https://big.com', category: 'SYSTEM', isPinned: false, tags: ['big'] },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, vi.fn()]);
    vi.mocked(useDashboardStore).mockReturnValue({ activeTag: null } as any);
    vi.clearAllMocks();
  });

  it('link rows should use larger font classes', () => {
    render(<LinksPane isAdding={false} setIsAdding={vi.fn()} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const filename = screen.getByText('BIG TEXT LINK');
    // We expect text-[11px] for retro mode
    expect(filename.className).toContain('text-[11px]');
    
    // Header should also be bold/large
    expect(screen.getByText('FILENAME').className).toContain('text-[9px]');
  });
});