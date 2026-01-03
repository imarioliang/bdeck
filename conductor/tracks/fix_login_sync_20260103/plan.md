# Plan: Fix Local Data Loss on Login

## Phase 1: Diagnostic & Reproduction
- [x] Task: Reproduction Test for Anonymous-to-Login Sync [b9b4acd]
    - Write a failing test in `src/components/sync/SyncManager.test.tsx` that simulates having local data as an anonymous user, logging in to an account with existing cloud data, and verifying that local data is NOT lost.
    - Confirm the test fails (Red phase).
- [x] Task: Conductor - User Manual Verification 'Diagnostic & Reproduction' (Protocol in workflow.md)
## [checkpoint: 5c69641]

## Phase 2: Logic Refinement
- [x] Task: Fix SyncManager Merge Strategy [be96b15]
    - Update `src/components/sync/SyncManager.tsx` to prioritize pushing anonymous local data to the cloud before performing the initial pull during a login event.
    - Ensure the logic distinguishes between "Anonymous -> User" (Merge) and "User A -> User B" (Wipe).
    - Verify that the reproduction test passes (Green phase).
- [ ] Task: Verify User Switch Integrity
    - Ensure that logging out and logging in as a different user still correctly triggers a wipe of the previous user's local cache.
- [ ] Task: Conductor - User Manual Verification 'Logic Refinement' (Protocol in workflow.md)

## Phase 3: Final Verification
- [ ] Task: Full Suite Regression
    - Run all automated tests to ensure no regressions in Link, Todo, or Timer functionality.
    - Perform a manual audit of the `SyncManager` state transitions.
- [ ] Task: Conductor - User Manual Verification 'Fix Local Data Loss on Login' (Protocol in workflow.md)
