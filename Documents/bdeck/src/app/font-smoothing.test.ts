import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Global Aesthetic - Font Smoothing', () => {
  it('should have CSS to disable antialiased font smoothing for retro skin', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for the retro skin font smoothing disable
    const hasRetroSmoothingDisable = cssContent.includes("[data-skin='retro'] body") && 
                                    cssContent.includes("-webkit-font-smoothing: none");
    
    expect(hasRetroSmoothingDisable).toBe(true);
  });

  it('should use Press Start 2P for retro skin', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasPressStart = cssContent.includes(":root[data-skin='retro']") && 
                          cssContent.includes("--font-family-base: var(--font-press-start)");
    
    expect(hasPressStart).toBe(true);
  });
});
