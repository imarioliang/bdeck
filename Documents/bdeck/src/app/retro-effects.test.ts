import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Retro Typography Effects', () => {
  it('should have text-shadow for retro skin', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for text-shadow in retro skin
    const hasTextGlow = cssContent.includes("[data-skin='retro']") && 
                        cssContent.includes("text-shadow:");
    
    expect(hasTextGlow).toBe(true);
  });

  it('should have scanline overlay styles', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasScanlines = cssContent.includes(".scanlines") || cssContent.includes("scanline");
    
    expect(hasScanlines).toBe(true);
  });
});
