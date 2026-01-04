import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Global Aesthetic - Font Smoothing', () => {
  it('should have CSS to disable antialiased font smoothing', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for the font smoothing disable in body
    const hasSmoothingDisable = cssContent.includes("body {") && 
                                cssContent.includes("-webkit-font-smoothing: none");
    
    expect(hasSmoothingDisable).toBe(true);
  });

  it('should use Press Start 2P by default', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasPressStart = cssContent.includes(":root {") && 
                          cssContent.includes("--font-family-base: var(--font-press-start)");
    
    expect(hasPressStart).toBe(true);
  });
});