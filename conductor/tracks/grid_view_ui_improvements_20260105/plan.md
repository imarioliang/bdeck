# Plan: Grid View UI Improvements

## Phase 1: Card Structure Refinement [checkpoint: f9f77d8]
*Goal: Move from basic bordered boxes to a structured Header/Body/Footer layout for grid items.*

- [x] **Task 1: Refactor SortableLinkItem Grid Layout** [f9f77d8]
    - [x] Sub-task: Create new sub-containers for Header (Pinned indicator), Body (Icon & Title), and Footer (Metadata).
    - [x] Sub-task: Implement strict 1px borders and internal padding consistency.
    - [x] Sub-task: Apply `Press Start 2P` font for titles and `VT323` for metadata.
- [x] **Task 2: Responsive Grid Optimization** [f9f77d8]
    - [x] Sub-task: Update Tailwind grid classes to ensure pleasing aspect ratios across viewports.
- [ ] **Task: Conductor - User Manual Verification 'Card Structure Refinement' (Protocol in workflow.md)**

## Phase 2: Action Toolbar Implementation [checkpoint: f9f77d8]
*Goal: Replace full-box overlay with a subtle, non-obstructive action row.*

- [x] **Task 1: Design and Implement Subtle Toolbar** [f9f77d8]
    - [x] Sub-task: Create a toolbar row (at top or bottom) that appears only on hover.
    - [x] Sub-task: Ensure primary content (Title/Icon) remains visible when the toolbar is shown.
    - [x] Sub-task: Update PIN, EDIT, and DEL buttons to use minimalist icons/text.
- [x] **Task 2: Hover State Refinement** [f9f77d8]
    - [x] Sub-task: Implement subtle border highlight or background shift for the card hover state.
- [ ] **Task: Conductor - User Manual Verification 'Action Toolbar Implementation' (Protocol in workflow.md)**

## Phase 3: Metadata and Icon Polish
*Goal: Enhance information density and visual clarity.*

- [ ] **Task 1: Implement Metadata Footer**
    - [ ] Sub-task: Render category shorthand (.EXT) and the first tag in the card footer.
    - [ ] Sub-task: Style footer text with dimmed contrast for hierarchy.
- [ ] **Task 2: Favicon/Icon Scaling**
    - [ ] Sub-task: Increase favicon size to 32px where appropriate.
    - [ ] Sub-task: Improve fallback icon centering and contrast.
- [ ] **Task: Conductor - User Manual Verification 'Metadata and Icon Polish' (Protocol in workflow.md)**

## Phase 4: Final Polish & Standards
*Goal: Ensure code quality and adherence to project conventions.*

- [ ] **Task 1: Audit and Test Verification**
    - [ ] Sub-task: Update existing tests to match new UI structure.
    - [ ] Sub-task: Verify >80% code coverage.
    - [ ] Sub-task: Run linting and type checks.
- [ ] **Task: Conductor - User Manual Verification 'Final Polish & Standards' (Protocol in workflow.md)**
