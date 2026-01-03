# Track Plan: Bug Fixes - Links, Timers, and React Keys

## Phase 1: Diagnostics and Key Warning Fix [checkpoint: 48fe0d5]
- [x] Task: Audit `TodoPane.tsx` to identify missing or unstable `key` props. (7d3c3f2)
- [x] Task: Ensure all list items (7d3c3f2) and components within the `SortableContext` use unique, persistent IDs as keys.
- [x] Task: Verify that the console warning is resolved (7d3c3f2).
- [x] Task: Conductor - User Manual Verification 'Key Warning Fix' (48fe0d5) (Protocol in workflow.md)

## Phase 2: Timers and Links Logic Fix [checkpoint: e557c9a]
- [x] Task: Analyze the `toggleTimer` and `intervalRefs` logic in `TimersPane.tsx` to identify why the "Stop" action fails. (c33f415)
- [x] Task: Fix the timer pause logic (9b7ffeb) (ee1ee8b) (e557c9a) (1700181) (c33f415) and write a unit test to verify that the timer stops correctly.
- [x] Task: Analyze the `startEditing` logic in `LinksPane.tsx` to identify why the edit form fails to open. (c33f415)
- [x] Task: Fix the link editing trigger (e557c9a) (1700181) (c33f415) and write a unit test to verify that the edit form opens correctly.
- [x] Task: Conductor - User Manual Verification 'Timers and Links Logic' (c33f415) (Protocol in workflow.md)
