# Track Specification: Mockup Layout Refinement

## 1. Overview
Restructure the dashboard layout and refine component UI to closely align with the visual hierarchy of `mock2.png`. This includes a two-row header, a "Directories" sidebar, high-contrast hover effects, and a decluttered "Timer Daemon" pane.

## 2. Functional & Visual Requirements
- **Two-Row Header (Retro Only):**
  - **Row 1 (System Bar):** Contains `[ COMMAND_CENTER_V1.0 ]` and window controls (`_ MIN [] MAX X CLOSE`).
  - **Row 2 (Path Bar):** Displays `PATH: C:\USERS\ADMIN\SHORTCUTS\` and integrates the Search input.
- **Directories Sidebar (Retro Only):**
  - New left-hand pane titled `[ DIRECTORIES ]`.
  - Category Tabs moved here as a vertical list.
  - Occupies ~20-25% of the dashboard's top section width.
- **High-Contrast Hover Effects:**
  - **Categories & Links:** On hover, apply a full-width background highlight (`--terminal-main`) with black text (`#000000`).
- **Project Timer Refinement (Timer Daemon):**
  - **Condensed Rows:** Simplify timer items into clean boxes with minimal status indicators (e.g., `[P]`, `[R]`, `[S]`).
  - **Relocated Inputs:** Move Work/Rest interval inputs (`W_INT`, `R_INT`) to a dedicated settings menu or a toggleable footer to clear the top area of the pane.
- **Repositioning:**
  - Align System Indicators (MEM, CPU) with the mockup's bottom status bar style.

## 3. Non-Functional Requirements
- **Responsive Adaptability:** Ensure the sidebar and header collapse gracefully on mobile.
- **Modern Skin Integrity:** These changes remain strictly scoped to `data-skin='retro'`.

## 4. Acceptance Criteria
- [ ] Header features two rows (System Bar and Path Bar) in Retro mode.
- [ ] Categories are displayed vertically in a left-hand sidebar.
- [ ] Hovering over categories/links shows high-contrast inverted colors.
- [ ] Timer items are condensed and the top area of the Timers pane is decluttered.
- [ ] Layout matches the visual balance of `mock2.png`.

## 5. Out of Scope
- Functional window controls or real file system integration for the "Directories" list.
