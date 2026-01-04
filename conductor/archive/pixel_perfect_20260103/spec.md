# Track Specification: Pixel Perfect Polish

## 1. Overview
Clean up the dashboard by removing redundant decorative text and enforcing strict layout constraints, uniform spacing, and precise border alignment to achieve a cohesive, high-end "pixel-perfect" terminal aesthetic.

## 2. Functional & Visual Requirements
- **UI De-cluttering (Retro Only):**
  - Remove all redundant placeholder text blocks currently positioned *below* the main pane boxes (e.g., "MEM: 64K", "stat: OK", "DIRS FOUND").
- **Task List (Task List) Enhancements:**
  - **Scaling:** Increase the font size for todo items significantly for better readability.
  - **Proportional Icons:** Scale checkboxes and drag handles up to match the new larger text size.
- **Layout Constraints (Retro Only):**
  - **Top Section (Directories & Links):** Implement a `max-height` of `500px` with internal scrolling using the `custom-scrollbar`.
  - **Bottom Section (Timer, Task, Log):** Enforce a `min-height` of `400px` for these `Pane` components.
- **Precision Alignment & Spacing:**
  - **Uniform Gutters:** Standardize the gap between all dashboard panes.
  - **Internal Padding:** Ensure consistent internal padding across all `Pane` components.
  - **Border Snap:** Precisely align the edges of the top and bottom dashboard sections to eliminate 1px overlaps or offsets.

## 3. Non-Functional Requirements
- **Stability:** The UI must remain perfectly stable during interactions (hover, add, filter).
- **Modern Skin Integrity:** All sizing and layout shifts must remain scoped to `data-skin='retro'`.

## 4. Acceptance Criteria
- [ ] Redundant status text below boxes is removed.
- [ ] Task List items and icons are larger and visually balanced.
- [ ] Top section respects the `500px` max-height and scrolls correctly.
- [ ] Bottom panes respect the `400px` min-height.
- [ ] All panes are perfectly aligned with uniform spacing and padding.

## 5. Out of Scope
- Modifying the Modern skin.
- Functional logic changes.
