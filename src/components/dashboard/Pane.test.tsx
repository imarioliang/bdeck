import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pane } from './Pane';

describe('Pane', () => {
  it('should render retro layout', () => {
    render(<Pane title="Test Pane" label="Label" children={<div>Content</div>} />);
    
    // Check for retro header format
    expect(screen.getByText('[ Test Pane ]')).toBeDefined();
    
    // Check for min-height constraint
    const pane = screen.getByText(/Test Pane/i).closest('.border-terminal-main');
    expect(pane?.className).toContain('min-h-[400px]');
  });
});