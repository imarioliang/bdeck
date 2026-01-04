import { render, screen } from '@testing-library/react';
import { Pane } from '@/components/dashboard/Pane';
import { DirectoriesSidebar } from '@/components/dashboard/DirectoriesSidebar';
import { vi, describe, it, expect } from 'vitest';

describe('UI De-cluttering', () => {
  it('Pane should NOT render redundant mockup footer', () => {
    render(<Pane title="Test" label="TEST"><div>Content</div></Pane>);
    
    // We expect these to be GONE after cleanup
    expect(screen.queryByText(/MEM: 64K/i)).toBeNull();
    expect(screen.queryByText(/stat: OK/i)).toBeNull();
  });

  it('DirectoriesSidebar should NOT render redundant counter', () => {
    const categories = ['SYSTEM'];
    render(<DirectoriesSidebar categories={categories} activeCategory="SYSTEM" setActiveCategory={vi.fn()} />);
    
    // We expect this to be GONE after cleanup
    expect(screen.queryByText(/DIRS FOUND/i)).toBeNull();
  });
});