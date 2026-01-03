import { render, screen, fireEvent } from '@testing-library/react';
import { DirectoriesSidebar } from './DirectoriesSidebar';
import { useSkin } from '@/hooks/useSkin';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('DirectoriesSidebar', () => {
  const mockSetActiveCategory = vi.fn();
  const categories = ['ALL SYSTEMS', 'DEVELOPMENT', 'SYSTEM'];

  beforeEach(() => {
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.clearAllMocks();
  });

  it('should render all categories', () => {
    render(<DirectoriesSidebar categories={categories} activeCategory="ALL SYSTEMS" setActiveCategory={mockSetActiveCategory} />);
    
    expect(screen.getByText('ALL SYSTEMS')).toBeDefined();
    expect(screen.getByText('DEVELOPMENT')).toBeDefined();
    expect(screen.getByText('SYSTEM')).toBeDefined();
  });

  it('should call setActiveCategory when a category is clicked', () => {
    render(<DirectoriesSidebar categories={categories} activeCategory="ALL SYSTEMS" setActiveCategory={mockSetActiveCategory} />);
    
    const devCategory = screen.getByText('DEVELOPMENT');
    fireEvent.click(devCategory);
    
    expect(mockSetActiveCategory).toHaveBeenCalledWith('DEVELOPMENT');
  });

  it('should apply active styling to the current category', () => {
    const { container } = render(<DirectoriesSidebar categories={categories} activeCategory="DEVELOPMENT" setActiveCategory={mockSetActiveCategory} />);
    
    // Check if the active category has the expected active class (to be defined in implementation)
    // We expect an inverted style or similar for active items
    const activeItem = screen.getByText('DEVELOPMENT').closest('button');
    expect(activeItem?.className).toContain('bg-terminal-main');
  });
});
