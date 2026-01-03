import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AsciiLogo } from './AsciiLogo';

describe('AsciiLogo', () => {
  it('should render terminal icon', () => {
    const { container } = render(<AsciiLogo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-terminal');
  });
});