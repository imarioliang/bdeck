# Track Specification: Retro Terminal Skin

## 1. Overview
The goal is to implement a new "Retro Terminal" skin for the Bdeck application, inspired by the provided mockup. This skin will be a comprehensive visual overhaul that mimics a classic CRT terminal interface (bracketed headers, high-contrast borders, monospace aesthetics) without overwriting the existing "Modern" design. Users will be able to toggle between the "Modern" and "Retro" skins via a new selector in the customization menu.

## 2. Functional Requirements
- **Skin Switching:**
  - Introduce a new state property `skin` (options: 'modern', 'retro') in the dashboard store.
  - Add a "Skin" toggle/selector to the `CustomizationMenu` to switch between 'Modern' and 'Retro'.
  - Persist the selected skin preference to local storage (and cloud sync if applicable).

- **Retro Skin Implementation:**
  - Create a distinct visual style that applies *only* when the 'retro' skin is active.
  - **Global Styles:**
    - Force a strictly monospace font family (e.g., Courier New, VT323, or a similar web font).
    - High-contrast borders (typically 1px solid primary color) around all major containers.
    - Black background with bright foreground colors (green/amber).
  - **Component Overrides:**
    - **Headers:** Wrap pane titles in brackets (e.g., `[ TASK_LIST ]`) and align them to look like terminal window headers.
    - **Panes/Containers:** Add specific borders and "status lines" (like `PID: 3`, `MEM: 64K`) to mimic the mockup.
    - **Links/Lists:** Style list items with ASCII-like markers (e.g., `>`) instead of standard icons or bullets.
    - **Inputs:** Style input fields to look like command prompts.

- **Theme Compatibility:**
  - The "Retro" skin should still respect the underlying color theme (Amber, Green, Blue) chosen by the user, applying that color to the terminal text/borders.

## 3. Non-Functional Requirements
- **Isolation:** The new skin styles must not bleed into or break the existing "Modern" layout. Use CSS variables or specific parent classes (e.g., `body[data-skin="retro"]`) to scope styles.
- **Performance:** Switching skins should be instant and not require a page reload.

## 4. Acceptance Criteria
- [ ] User can select "Retro" from the customization menu, and the UI immediately updates.
- [ ] In "Retro" mode, all pane headers appear in the `[ TITLE ]` format.
- [ ] In "Retro" mode, borders are high-contrast and follow the mockup's style.
- [ ] Switching back to "Modern" restores the original look exactly as it was.
- [ ] The selected skin persists after a page reload.

## 5. Out of Scope
- Adding new functional features (like the "Directories" or "System Log" panes seen in the mockup) that don't currently exist in Bdeck. We are only skinning existing components (Links, Todos, Timers, Notes).
- deeply complex CRT shader effects (scanlines, curvature) for this iteration, unless they can be easily added via simple CSS.
