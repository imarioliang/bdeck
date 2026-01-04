import { render, screen } from '@testing-library/react';
import { DirectoriesSidebar } from '@/components/dashboard/DirectoriesSidebar';
import { LinksPane } from '@/components/dashboard/LinksPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('High-Contrast Hover Effects', () => {
  const mockSetActiveCategory = vi.fn();
  const categories = ['SYSTEM'];
  const initialLinks = [{ id: '1', title: 'Mail', url: 'https://mail.com', isPinned: false, category: 'SYSTEM', tags: [] }];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, vi.fn()]);
    vi.clearAllMocks();
  });

  it('sidebar categories should have inverted hover classes', () => {
    render(<DirectoriesSidebar categories={categories} activeCategory="ALL SYSTEMS" setActiveCategory={mockSetActiveCategory} />);
    
    const categoryButton = screen.getByText('SYSTEM').closest('button');
    expect(categoryButton?.className).toContain('retro-hover-invert');
  });

  it('link items should have inverted hover classes', () => {
    render(<LinksPane isAdding={false} setIsAdding={vi.fn()} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const linkItem = screen.getByText('Mail').closest('.group');
    expect(linkItem?.className).toContain('retro-hover-invert');
  });
});