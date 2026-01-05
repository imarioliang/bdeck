# Plan: Action Button Enhancement

## Phase 1: Layout & Spacing
*Goal: Increase the target area and horizontal spread of the action buttons.*

- [~] **Task 1: Refactor Action Toolbar Layout**
    - [ ] Sub-task: Update the flex/grid layout of the center overlay in `SortableLinkItem` to increase horizontal spacing between buttons.
    - [ ] Sub-task: Increase internal padding for each button to enlarge the clickable hit area.
- [ ] **Task: Conductor - User Manual Verification 'Layout & Spacing' (Protocol in workflow.md)**

## Phase 2: Interactive Feedback
*Goal: Implement the subtle pulse effect and refine transitions.*

- [ ] **Task 1: Implement Hover Animation**
    - [ ] Sub-task: Add a subtle CSS pulse animation to the button hover state.
    - [ ] Sub-task: Ensure the animation integrates smoothly with the existing color inversion logic.
- [ ] **Task 2: UI Polish**
    - [ ] Sub-task: Refine transitions between idle and active states for a responsive feel.
- [ ] **Task: Conductor - User Manual Verification 'Interactive Feedback' (Protocol in workflow.md)**

## Phase 3: Final Polish & Standards
*Goal: Ensure code quality and consistency.*

- [ ] **Task 1: Verification & Audit**
    - [ ] Sub-task: Update existing tests to reflect layout changes.
    - [ ] Sub-task: Verify >80% code coverage.
    - [ ] Sub-task: Run linting and type checks.
- [ ] **Task: Conductor - User Manual Verification 'Final Polish & Standards' (Protocol in workflow.md)**
