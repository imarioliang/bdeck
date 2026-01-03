import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AsciiLogo } from './AsciiLogo';

describe('AsciiLogo', () => {
  it('should render ascii art text', () => {
    render(<AsciiLogo />);
    const pre = screen.getByText((content) => content.includes('____'));
    expect(pre).toBeInTheDocument();
    expect(pre.tagName).toBe('PRE');
  });
});
