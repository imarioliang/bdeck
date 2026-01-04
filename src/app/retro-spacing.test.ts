import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Retro Typography Spacing', () => {
  it('should have adjusted letter-spacing', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for letter-spacing in body
    const hasAdjustedSpacing = cssContent.includes("body {") && 
                               cssContent.includes("letter-spacing:");
    
    expect(hasAdjustedSpacing).toBe(true);
  });

  it('should have adjusted line-height', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for line-height in body
    const hasAdjustedLineHeight = cssContent.includes("body {") && 
                                  cssContent.includes("line-height:");
    
    expect(hasAdjustedLineHeight).toBe(true);
  });

  it('should use VT323 for input fields', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasInputHierarchy = cssContent.includes("input, textarea, select {") && 
                              cssContent.includes("font-family: var(--font-vt323)");
    
    expect(hasInputHierarchy).toBe(true);
  });
});