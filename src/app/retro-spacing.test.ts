import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Retro Typography Spacing', () => {
  it('should have adjusted letter-spacing for retro skin', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for letter-spacing in retro skin
    const hasAdjustedSpacing = cssContent.includes("[data-skin='retro']") && 
                               cssContent.includes("letter-spacing:");
    
    expect(hasAdjustedSpacing).toBe(true);
  });

  it('should have adjusted line-height for retro skin', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for line-height in retro skin
    const hasAdjustedLineHeight = cssContent.includes("[data-skin='retro']") && 
                                  cssContent.includes("line-height:");
    
    expect(hasAdjustedLineHeight).toBe(true);
  });

  it('should use VT323 for input fields in retro skin', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasInputHierarchy = cssContent.includes("[data-skin='retro'] input") && 
                              cssContent.includes("font-family: var(--font-vt323)");
    
    expect(hasInputHierarchy).toBe(true);
  });
});
