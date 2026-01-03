# Track Plan: Pixel Perfect Polish

## Phase 1: De-cluttering & Global Cleanup
- [x] Task: Create Tests for UI De-cluttering. (644081f)
- [x] Task: Remove Redundant Footers in `Pane.tsx`. (644081f)
- [x] Task: Remove Redundant Counters in `DirectoriesSidebar.tsx`. (644081f)
- [~] Task: Conductor - User Manual Verification 'De-cluttering & Global Cleanup' (Protocol in workflow.md)

## Phase 2: Task List Enhancements
- [ ] Task: Create Tests for Task List Scaling.
    - [ ] Verify font size and icon dimensions for todo items in Retro mode.
- [ ] Task: Refactor `TodoPane.tsx` for Retro Scaling.
    - [ ] Increase font size for task text.
    - [ ] Increase size of checkboxes and drag handles proportionally.
    - [ ] Ensure vertical alignment remains centered.
- [ ] Task: Conductor - User Manual Verification 'Task List Enhancements' (Protocol in workflow.md)

## Phase 3: Structural Constraints (Min/Max Heights)
- [ ] Task: Create Tests for Height Constraints.
    - [ ] Verify `max-height` on top section and `min-height` on bottom panes.
- [ ] Task: Implement Max-Height and Scrolling for Top Section.
    - [ ] Wrap `DirectoriesSidebar` and `LinksPane` containers in a `max-h-[500px]` div with `overflow-y-auto`.
- [ ] Task: Implement Min-Height for Bottom Panes.
    - [ ] Update `Pane.tsx` to accept or enforce a `min-h-[400px]` class in Retro mode for the main dashboard grid.
- [ ] Task: Conductor - User Manual Verification 'Structural Constraints' (Protocol in workflow.md)

## Phase 4: Spacing & Alignment Standardization
- [ ] Task: Create Tests for Spacing and Alignment.
    - [ ] Verify uniform gutters and padding.
- [ ] Task: Standardize Dashboard Gutters.
    - [ ] Update the main grid/flex gaps in `src/app/page.tsx` to use a consistent value (e.g., `gap-6`).
- [ ] Task: Standardize Internal Padding.
    - [ ] Audit `Pane.tsx`, `LinksPane.tsx`, and `DirectoriesSidebar.tsx` to ensure matching internal whitespace.
- [ ] Task: Implement Border Snap Alignment.
    - [ ] Ensure the width of the top container perfectly matches the total width of the bottom pane row.
- [ ] Task: Conductor - User Manual Verification 'Spacing & Alignment' (Protocol in workflow.md)

## Phase 5: Final Audit & Stability
- [ ] Task: Final Visual Audit.
    - [ ] Audit all interactions (hover, toggle, filter) for "jumpy" layout shifts.
- [ ] Task: Conductor - User Manual Verification 'Final Audit & Stability' (Protocol in workflow.md)
