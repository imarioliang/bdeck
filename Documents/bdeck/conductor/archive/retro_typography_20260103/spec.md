# Track Specification: Retro Typography Polish

## 1. Overview
Enhance the visual authenticity of the "Retro Terminal" skin's typography by adding CRT-specific effects and refining font properties for better readability and density.

## 2. Functional & Visual Requirements
- **CRT Glow Effect:**
  - Apply a `text-shadow` to all text when `data-skin='retro'` is active.
  - The glow should use the `--terminal-main` color with a small blur radius (e.g., `0 0 4px`).
- **Scanline Overlay:**
  - Implement a global overlay with a CSS linear-gradient to simulate CRT scanlines.
  - This should only be visible when the Retro skin is active.
- **Typography Refinement:**
  - Tweak `letter-spacing` (e.g., `-0.05em`) for `Press Start 2P` to make it more compact.
  - Adjust `line-height` to ensure multi-line text doesn't look too sparse.
- **Font Hierarchy:**
  - Experiment with using `VT323` for smaller secondary labels (like the status bar or PIDs) while keeping `Press Start 2P` for primary headings and link titles.

## 3. Non-Functional Requirements
- **Performance:** CSS-based scanlines and shadows must not significantly impact rendering performance.
- **Modern Skin Integrity:** These changes must remain scoped to `data-skin='retro'`.

## 4. Acceptance Criteria
- [ ] Text has a visible but subtle glow in Retro mode.
- [ ] Scanlines are visible across the dashboard in Retro mode.
- [ ] Typography feels more compact and information-dense.
