# Specification: Link View Toggle (Grid/List) - Retro Only

## 1. Overview
Implement a user-controlled toggle to switch the Links Pane display between a "List View" and a "Grid View" within the strict Retro terminal aesthetic. **Crucially, this track also involves the complete removal of any remaining "Modern" theme code or logic**, cementing the application as a Retro-only experience. The view preference will be persisted locally.

## 2. Functional Requirements
- **Modern Theme Removal:**
    - Audit `LinksPane.tsx`, `Header.tsx` (and related tests), and global styles.
    - Remove conditional checks for `!isRetro` or `skin === 'modern'`.
    - Delete any components or CSS classes specifically serving the Modern aesthetic (e.g., glassmorphism effects, non-pixelated layouts).
    - Hardcode/Refactor the system to assume `Retro` is the only state.
- **View Toggle Control:**
    - Add a toggle button/icon in the header area of the `LinksPane`.
    - The button should swap between "List" and "Grid" iconography/text.
- **View Modes (Retro Only):**
    - **List View:** The existing high-density vertical list layout.
    - **Grid View:** A new tiled layout designed for the terminal aesthetic.
        - Each link is a distinct block with strict 1px `border-terminal-main`.
        - Content includes Title (truncated), shorthand category, and status/icon.
- **Persistence:**
    - Save the view mode preference to `LocalStorage` (key: `bdeck-links-view-mode`).
    - Default to 'List'.

## 3. User Interface & Experience
- **Location:** The toggle fits into the Retro "System Bar" or Pane Header.
- **Aesthetic:**
    - **Grid View:** Must maintain the "Bordered Box" look. No rounded corners, no transparency (unless scanline effects), strict monospace alignment.
    - **Hover:** Retro inversion (Background becomes Terminal Main color, Text becomes Black).

## 4. Technical Considerations
- **Refactoring:**
    - Simplify `LinksPane.tsx` by removing the `!isRetro` branch.
    - Update `useDashboardStore` or `useSkin` if they still hold "Modern" state options.
- **State Management:** Add `viewMode` ('list' | 'grid') to `useDashboardStore` (persisted).

## 5. Acceptance Criteria
- [ ] No "Modern" theme code remains in `LinksPane` or related components.
- [ ] Toggle switch changes layout between List and Grid.
- [ ] Grid View looks authentic to the Retro/Terminal style (borders, fonts).
- [ ] View preference survives page reload.
- [ ] All tests pass (and old tests for Modern mode are removed).
