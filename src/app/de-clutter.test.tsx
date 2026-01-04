import { render, screen } from '@testing-library/react';
import { Pane } from '@/components/dashboard/Pane';
import { DirectoriesSidebar } from '@/components/dashboard/DirectoriesSidebar';
import { useSkin } from '@/hooks/useSkin';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('UI De-cluttering', () => {
  beforeEach(() => {
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.clearAllMocks();
  });

  it('Pane should NOT render redundant mockup footer in retro mode', () => {
    render(<Pane title="Test" label="TEST"><div>Content</div></Pane>);
    
    // We expect these to be GONE after cleanup
    expect(screen.queryByText(/MEM: 64K/i)).toBeNull();
    expect(screen.queryByText(/stat: OK/i)).toBeNull();
  });

  it('DirectoriesSidebar should NOT render redundant counter in retro mode', () => {
    const categories = ['SYSTEM'];
    render(<DirectoriesSidebar categories={categories} activeCategory="SYSTEM" setActiveCategory={vi.fn()} />);
    
    // We expect this to be GONE after cleanup
    expect(screen.queryByText(/DIRS FOUND/i)).toBeNull();
  });
});
