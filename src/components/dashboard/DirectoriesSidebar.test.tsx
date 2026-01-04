import { render, screen, fireEvent } from '@testing-library/react';
import { DirectoriesSidebar } from './DirectoriesSidebar';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('DirectoriesSidebar', () => {
  const mockSetActiveCategory = vi.fn();
  const mockSetActiveTag = vi.fn();
  const categories = ['SYSTEM', 'DEVELOPMENT'];
  const tags = ['work', 'personal'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all categories and tags', () => {
    render(<DirectoriesSidebar 
      categories={categories} 
      activeCategory="SYSTEM" 
      setActiveCategory={mockSetActiveCategory} 
      tags={tags}
      activeTag={null}
      setActiveTag={mockSetActiveTag}
    />);
    
    expect(screen.getByText('SYSTEM')).toBeDefined();
    expect(screen.getByText('DEVELOPMENT')).toBeDefined();
    expect(screen.getByText('work')).toBeDefined();
    expect(screen.getByText('personal')).toBeDefined();
  });

  it('should call setActiveTag when a tag is clicked', () => {
    render(<DirectoriesSidebar 
      categories={categories} 
      activeCategory="SYSTEM" 
      setActiveCategory={mockSetActiveCategory} 
      tags={tags}
      activeTag={null}
      setActiveTag={mockSetActiveTag}
    />);
    
    const workTag = screen.getByText('work');
    fireEvent.click(workTag);
    
    expect(mockSetActiveTag).toHaveBeenCalledWith('work');
  });

  it('should apply active styling to the current category', () => {
    render(<DirectoriesSidebar 
      categories={categories} 
      activeCategory="DEVELOPMENT" 
      setActiveCategory={mockSetActiveCategory} 
      tags={tags}
      activeTag={null}
      setActiveTag={mockSetActiveTag}
    />);
    
    // Check if the active category has the expected active class
    const activeItem = screen.getByText('DEVELOPMENT').closest('button');
    expect(activeItem?.className).toContain('retro-invert');
  });
});