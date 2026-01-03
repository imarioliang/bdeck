import { render, screen } from '@testing-library/react';
import { DirectoriesSidebar } from '@/components/dashboard/DirectoriesSidebar';
import { LinksPane } from '@/components/dashboard/LinksPane';
import { useSkin } from '@/hooks/useSkin';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('High-Contrast Hover Effects', () => {
  const mockSetActiveCategory = vi.fn();
  const categories = ['SYSTEM'];
  const initialLinks = [{ id: '1', title: 'Mail', url: 'https://mail.com', isPinned: false }];

  beforeEach(() => {
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, vi.fn()]);
    vi.clearAllMocks();
  });

  it('sidebar categories should have inverted hover classes', () => {
    render(<DirectoriesSidebar categories={categories} activeCategory="ALL SYSTEMS" setActiveCategory={mockSetActiveCategory} />);
    
    const categoryButton = screen.getByText('SYSTEM').closest('button');
    expect(categoryButton?.className).toContain('hover:bg-terminal-main');
    expect(categoryButton?.className).toContain('hover:text-black');
  });

  it('link items should have inverted hover classes', () => {
    render(<LinksPane isAdding={false} setIsAdding={vi.fn()} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // The container of the link should have the hover effect
    const linkItem = screen.getByText('Mail').closest('.group');
    // Note: My previous check showed it had hover:bg-terminal-main/10, we want hover:bg-terminal-main
    expect(linkItem?.className).toContain('hover:bg-terminal-main');
    expect(linkItem?.className).toContain('hover:text-black');
  });
});
