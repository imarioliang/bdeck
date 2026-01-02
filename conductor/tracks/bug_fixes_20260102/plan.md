# Track Plan: Bug Fixes - Links, Timers, and React Keys

## Phase 1: Diagnostics and Key Warning Fix
- [ ] Task: Audit `TodoPane.tsx` to identify missing or unstable `key` props.
- [x] Task: Ensure all list items (7d3c3f2) and components within the `SortableContext` use unique, persistent IDs as keys.
- [x] Task: Verify that the console warning is resolved (7d3c3f2).
- [ ] Task: Conductor - User Manual Verification 'Key Warning Fix' (Protocol in workflow.md)

## Phase 2: Timers and Links Logic Fix
- [ ] Task: Analyze the `toggleTimer` and `intervalRefs` logic in `TimersPane.tsx` to identify why the "Stop" action fails.
- [ ] Task: Fix the timer pause logic and write a unit test to verify that the timer stops correctly.
- [ ] Task: Analyze the `startEditing` logic in `LinksPane.tsx` to identify why the edit form fails to open.
- [ ] Task: Fix the link editing trigger and write a unit test to verify that the edit form opens correctly.
- [ ] Task: Conductor - User Manual Verification 'Timers and Links Logic' (Protocol in workflow.md)
