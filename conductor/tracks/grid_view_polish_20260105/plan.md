# Plan: Grid View Polish & Interactions

## Phase 1: Inversion & Overlay Layout [checkpoint: ed57894]
*Goal: Implement the "Full Card Inversion" effect and the "Center Overlay" container for actions.*

- [x] **Task 1: Refactor SortableLinkItem Hover State** [ed57894]
    - [x] Sub-task: Implement CSS logic for full-card inversion (Background: Main, Text: Black) on hover.
    - [x] Sub-task: Create the "Center Overlay" container with subtle dimming/blurring of the background.
    - [x] Sub-task: Remove the bottom-tab action toolbar from Phase 1 of the previous track.
- [ ] **Task: Conductor - User Manual Verification 'Inversion & Overlay Layout' (Protocol in workflow.md)**

## Phase 2: Action Button Refinement [checkpoint: ed57894]
*Goal: Implement and style the minimalist symbols for managing links.*

- [x] **Task 1: Implement Minimalist Symbols** [ed57894]
    - [x] Sub-task: Add `[P]`, `[E]`, and `[X]` buttons to the center overlay.
    - [x] Sub-task: Implement "Double Inversion" styling for buttons (Background: Black, Text: Main) on hover within the inverted card.
    - [x] Sub-task: Map existing management functions (Pin, Edit, Delete) to the new buttons.
- [x] **Task 2: UI Polish** [ed57894]
    - [x] Sub-task: Add smooth fade-in/fade-out transitions for the center overlay.
    - [x] Sub-task: Ensure the drag handle `[::]` is integrated into the new overlay layout.
- [ ] **Task: Conductor - User Manual Verification 'Action Button Refinement' (Protocol in workflow.md)**

## Phase 3: Final Sweep & Testing
*Goal: Ensure consistency and stability across all interactions.*

- [ ] **Task 1: Interaction Audit**
    - [ ] Sub-task: Verify that all Management actions work as expected in the new layout.
    - [ ] Sub-task: Update tests in `LinksPane.gridRefinement.test.tsx` and `LinksPane.actionToolbar.test.tsx` to match the new UI.
- [ ] **Task 2: Standards & Quality**
    - [ ] Sub-task: Verify >80% code coverage.
    - [ ] Sub-task: Run linting and type checks.
- [ ] **Task: Conductor - User Manual Verification 'Final Sweep & Testing' (Protocol in workflow.md)**
