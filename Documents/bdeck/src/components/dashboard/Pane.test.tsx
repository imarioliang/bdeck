import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pane } from './Pane';
import { useSkin } from '@/hooks/useSkin';

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('Pane', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modern layout by default', () => {
    (useSkin as unknown as ReturnType<typeof vi.fn>).mockReturnValue('modern');
    render(<Pane title="Test Pane" label="Label" children={<div>Content</div>} />);
    
    // Check for modern specific elements (e.g. the dot)
    expect(screen.getByText('Test Pane')).toBeDefined();
    expect(screen.queryByText('[ Test Pane ]')).toBeNull();
  });

  it('should render retro layout when skin is retro', () => {
    (useSkin as unknown as ReturnType<typeof vi.fn>).mockReturnValue('retro');
    render(<Pane title="Test Pane" label="Label" children={<div>Content</div>} />);
    
    // Check for retro header format
    expect(screen.getByText('[ Test Pane ]')).toBeDefined();
    // Check for retro status line
    expect(screen.getByText('MEM: 64K')).toBeDefined();
  });
});
