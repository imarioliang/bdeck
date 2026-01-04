# Plan: Link View Toggle (Grid/List) - Retro Only

## Phase 1: Modern Theme Purge [checkpoint: aa8c5b1]
*Goal: Remove all remaining "Modern" theme code to simplify the codebase and prepare for Retro-only expansion.*

- [x] **Task 1: Audit and Cleanup Store/Hooks** [aa8c5b1]
    - [x] Sub-task: Remove `modern` from `TerminalTheme` types if applicable.
    - [x] Sub-task: Simplify `useSkin.ts` to return only 'retro' (if not already done).
    - [x] Sub-task: Remove any skin-switching logic from `useDashboardStore.ts`.
- [x] **Task 2: Cleanup Component Conditionals** [aa8c5b1]
    - [x] Sub-task: Refactor `LinksPane.tsx` to remove `!isRetro` blocks.
    - [x] Sub-task: Refactor `HeaderIndicators.tsx` to remove `!isRetro` blocks.
    - [x] Sub-task: Clean up `globals.css` of any non-retro utility classes.
- [x] **Task 3: Remove Obsolete Tests** [aa8c5b1]
    - [x] Sub-task: Identify and delete tests that explicitly check for "Modern" behavior (e.g., in `header.test.tsx`, `LinksPane.test.tsx`).
    - [x] Sub-task: Run existing test suite to ensure no breakage.
- [ ] **Task: Conductor - User Manual Verification 'Modern Theme Purge' (Protocol in workflow.md)**

## Phase 2: View Mode State & Toggle UI [checkpoint: e4747c3]
*Goal: Implement the persistent state for view mode and the UI controls to switch it.*

- [x] **Task 1: Update Dashboard Store** [e4747c3]
    - [x] Sub-task: Add `viewMode: 'list' | 'grid'` to `DashboardState`.
    - [x] Sub-task: Add `setViewMode` action to the store.
    - [x] Sub-task: Ensure `viewMode` is persisted in `bdeck-dashboard-storage`.
- [x] **Task 2: Implement Toggle Button** [e4747c3]
    - [x] Sub-task: Create failing tests for the View Toggle button in `LinksPane`.
    - [x] Sub-task: Implement the toggle button in the `LinksPane` header (Retro style).
    - [x] Sub-task: Verify button switches state in store.
- [ ] **Task: Conductor - User Manual Verification 'View Mode State & Toggle UI' (Protocol in workflow.md)**

## Phase 3: Retro Grid View Implementation
*Goal: Create the "Bordered Box" grid layout for links in the Retro aesthetic.*

- [x] **Task 1: Layout Refactoring** [e4747c3]
    - [x] Sub-task: Update `LinksPane.tsx` to conditionally render a `Grid` container vs the current `List` container.
- [x] **Task 2: Implement Retro Grid Item** [e4747c3]
    - [x] Sub-task: Write tests for `SortableLinkItem` in 'grid' mode.
    - [x] Sub-task: Style the grid item: 1px border, truncated title, shorthand metadata.
    - [x] Sub-task: Ensure hover effects (inversion) work correctly in grid tiles.
- [x] **Task 3: Drag and Drop Verification** [e4747c3]
    - [x] Sub-task: Ensure `dnd-kit` sortable logic works correctly within the new grid layout.
- [ ] **Task: Conductor - User Manual Verification 'Retro Grid View Implementation' (Protocol in workflow.md)**

## Phase 4: Final Polish & Standards
*Goal: Ensure the feature meets all quality gates and aesthetic requirements.*

- [ ] **Task 1: Final Audit**
    - [ ] Sub-task: Verify >80% coverage for new logic.
    - [ ] Sub-task: Run linting and type checks.
- [ ] **Task: Conductor - User Manual Verification 'Final Polish & Standards' (Protocol in workflow.md)**
