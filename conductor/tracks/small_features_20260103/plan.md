# Plan: Small UX Improvements & Indicators

## Phase 1: Global Indicators (Sync & Environment)
- [x] Task: Implement Sync Status Store [fbf6efe]
    - Update `useDashboardStore` to include `syncStatus` ('idle', 'syncing', 'error').
    - Write unit tests for store updates.
- [x] Task: Update SyncManager Status Reporting [bbc608d]
    - Modify `src/components/sync/SyncManager.tsx` to update the global `syncStatus` during push and pull operations.
- [x] Task: Create HeaderIndicators Component [ba40752]
    - Create `src/components/dashboard/HeaderIndicators.tsx`.
    - Implement the Sync Indicator (icon + text, pulsing animation for 'syncing').
    - Implement the Branch Indicator (displays `process.env.NODE_ENV` and a branch placeholder, visible only in dev).
- [x] Task: Integrate Indicators into Header [9178855]
    - Update `src/app/page.tsx` to render `HeaderIndicators` in the header section near the title.
- [x] Task: Conductor - User Manual Verification 'Global Indicators' (Protocol in workflow.md)
## [checkpoint: b1e1a35]

## Phase 2: UX Refinements (Timers & Links)
- [ ] Task: Inline Timer Name Editing
    - Modify `src/components/dashboard/TimersPane.tsx` (`SortableTimerItem`) to support an editing state for the timer name.
    - Implement `onClick` to trigger edit mode.
    - Implement `onKeyDown` (Enter) and `onBlur` to commit changes to the store.
- [ ] Task: Link Modal Keyboard Support
    - Update the modal inputs in `src/components/dashboard/LinksPane.tsx` to trigger `addLink()` when the `Enter` key is pressed.
- [ ] Task: Conductor - User Manual Verification 'UX Refinements' (Protocol in workflow.md)

## Phase 3: Final Verification
- [ ] Task: Conductor - User Manual Verification 'Small UX Improvements & Indicators' (Protocol in workflow.md)
