# Track Plan: Mockup Layout Refinement

## Phase 1: Header Restructuring [checkpoint: 00ed3ce]
- [x] Task: Create Tests for Two-Row Header. (d65473a, 7114fe2)
- [x] Task: Implement Two-Row Header in `src/app/page.tsx`. (d65473a, 7114fe2)
    - [x] Add Row 1: System Bar with `[ COMMAND_CENTER_V1.0 ]` and window controls.
    - [x] Add Row 2: Path Bar with `PATH:` label and Search integration.
    - [x] Ensure components are styled with high-contrast borders.
- [x] Task: Conductor - User Manual Verification 'Header Restructuring' (Protocol in workflow.md) (7114fe2)

## Phase 2: Directories Sidebar
- [ ] Task: Create Tests for Directories Sidebar.
- [ ] Task: Implement `DirectoriesSidebar` component.
    - [ ] Move Category navigation logic into a new vertical component.
    - [ ] Update `src/app/page.tsx` to include the sidebar in a flex layout for the top section.
    - [ ] Title the pane `[ DIRECTORIES ]` with mockup-style borders.
- [ ] Task: Conductor - User Manual Verification 'Directories Sidebar' (Protocol in workflow.md)

## Phase 3: High-Contrast Hover Effects
- [ ] Task: Create Tests for Hover Interactions.
- [ ] Task: Implement Inverted Hover Styles in `src/app/globals.css`.
    - [ ] Add utility for background color highlight and black text on hover.
- [ ] Task: Apply Hover Effects to Categories and Links.
    - [ ] Update `DirectoriesSidebar` and `LinksPane` components to use the new hover utility.
- [ ] Task: Conductor - User Manual Verification 'High-Contrast Hover Effects' (Protocol in workflow.md)

## Phase 4: Timer Daemon Refinement
- [ ] Task: Create Tests for Condensed Timer Rows.
- [ ] Task: Refactor `TimersPane.tsx`.
    - [ ] Condense timer rows into tight, single-line boxes.
    - [ ] Move Work/Rest interval inputs to a dedicated settings footer or modal.
    - [ ] Title the pane `[ TIMER_DAEMON ]`.
- [ ] Task: Conductor - User Manual Verification 'Timer Daemon Refinement' (Protocol in workflow.md)

## Phase 5: Repositioning & Final Audit
- [ ] Task: Update Global Layout Repositioning.
    - [ ] Align System Indicators (MEM, CPU) with the bottom footer status bar style.
    - [ ] Ensure responsive behavior collapses sidebar on mobile.
- [ ] Task: Final Visual Audit against `mock2.png`.
- [ ] Task: Conductor - User Manual Verification 'Repositioning & Final Audit' (Protocol in workflow.md)
