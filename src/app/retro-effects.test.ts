import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Retro Typography Effects', () => {
  it('should NOT have text-shadow in body', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check if body has text-shadow
    const bodyMatch = cssContent.match(/body\s*{[^}]*}/);
    const hasTextGlow = bodyMatch ? bodyMatch[0].includes("text-shadow:") : false;
    
    expect(hasTextGlow).toBe(false);
  });

  it('should have scanline overlay styles', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasScanlines = cssContent.includes("scanline");
    
    expect(hasScanlines).toBe(true);
  });
});