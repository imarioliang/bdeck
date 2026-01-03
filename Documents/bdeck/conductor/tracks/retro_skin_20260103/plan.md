# Track Plan: Retro Terminal Skin

## Phase 1: Store & Global Styles Infrastructure [checkpoint: b1c8e17]
- [x] Task: Update `DashboardStore` to support skin selection.
    - [x] Add `skin: 'modern' | 'retro'` to the store interface and initial state.
    - [x] Update `useDashboardStore` to persist the `skin` preference.
- [x] Task: Create global CSS variables for the Retro skin.
    - [x] Add `[data-skin='retro']` variables to `globals.css` (fonts, borders, colors).
    - [x] Import a retro web font (e.g., VT323 or similar) in the root layout.
- [x] Task: Update `ThemeWrapper` to apply the skin attribute.
    - [x] Modify `ThemeWrapper.tsx` to read the `skin` state and apply `data-skin="..."` to the `<html>` element.
- [x] Task: Conductor - User Manual Verification 'Store & Global Styles Infrastructure' (Protocol in workflow.md)

## Phase 2: Component Skinning (Part 1 - Layout & Headers)
- [x] Task: Create a `SkinAware` container or utility.
    - [ ] Create a utility class or component that conditionally applies retro styles (borders, padding) based on the active skin.
- [x] Task: Update `Pane` components to support retro headers.
    - [ ] Modify `Pane.tsx` (or equivalent wrappers) to render `[ TITLE ]` style headers when in retro mode.
    - [ ] Add the "status line" mock elements (e.g., memory, PID placeholders) to the pane footer/header for visual flair.
- [ ] Task: Conductor - User Manual Verification 'Component Skinning (Part 1 - Layout & Headers)' (Protocol in workflow.md)

## Phase 3: Component Skinning (Part 2 - Content)
- [ ] Task: Skin `LinksPane` and `SortableLinkItem`.
    - [ ] Apply retro hover effects and list markers (`>`) to link items.
- [ ] Task: Skin `TodoPane` and `TodoItem`.
    - [ ] Style checkboxes and text inputs to match the terminal aesthetic (e.g., `[x]` vs `[ ]`).
- [ ] Task: Skin `TimersPane`.
    - [ ] Update the digital clock font and button styles to look like terminal commands.
- [ ] Task: Skin `NotesPane`.
    - [ ] Ensure the textarea mimics a terminal text editor (monospaced, caret style).
- [ ] Task: Conductor - User Manual Verification 'Component Skinning (Part 2 - Content)' (Protocol in workflow.md)

## Phase 4: UI Controls & Polish
- [ ] Task: Add Skin Selector to `CustomizationMenu`.
    - [ ] Implement a toggle or radio group in the menu to switch between "Modern" and "Retro".
- [ ] Task: Final Visual Audit & Tweaks.
    - [ ] Check contrast ratios in retro mode with all three color themes (Amber, Green, Blue).
    - [ ] Ensure specific "glitch" or CRT effects (if simple) are applied correctly.
- [ ] Task: Conductor - User Manual Verification 'UI Controls & Polish' (Protocol in workflow.md)
