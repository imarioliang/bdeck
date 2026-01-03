import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Glitch Hover Animations', () => {
  it('should have glitch keyframes defined in globals.css', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    expect(cssContent.includes('@keyframes glitch')).toBe(true);
    expect(cssContent.includes('@keyframes shake')).toBe(true);
  });

  it('should have retro-glitch-hover utility class', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    expect(cssContent.includes('.retro-glitch-hover')).toBe(true);
  });
});
