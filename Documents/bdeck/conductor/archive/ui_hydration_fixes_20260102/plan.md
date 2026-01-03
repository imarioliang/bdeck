# Plan: Fix Hydration, Categories UI, and Theme/Font Toggles

This plan addresses the hydration mismatch causing UI breakage in the Links Categories and failure of Theme/Font Size toggles.

## Phase 1: Diagnosis and Test Setup [checkpoint: 10d3631]
- [x] Task: Identify specific hydration mismatch points in `layout.tsx` or `page.tsx`
- [x] Task: Create reproduction tests for the Categories UI alignment issue
- [x] Task: Create failing tests for Theme and Font Size toggles
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis and Test Setup' (Protocol in workflow.md)

## Phase 2: Resolve Hydration Error [checkpoint: ab66e3b]
- [x] Task: Implement a 'mounted' state check or `useEffect` pattern to prevent server/client mismatch for `localStorage` dependent values
- [x] Task: Ensure the initial render is consistent regardless of the stored theme/font size
- [x] Task: Verify that the console no longer reports hydration errors
- [x] Task: Conductor - User Manual Verification 'Phase 2: Resolve Hydration Error' (Protocol in workflow.md)

## Phase 3: Restore UI and Toggles [checkpoint: c89257f]
- [x] Task: Fix styling for Links Categories UI to ensure proper alignment and spacing
- [x] Task: Restore event handling for Theme Toggle
- [x] Task: Restore event handling for Font Size Toggle
- [x] Task: Verify persistence of selections after page refresh
- [x] Task: Conductor - User Manual Verification 'Phase 3: Restore UI and Toggles' (Protocol in workflow.md)

## Phase 4: Final Verification and Cleanup [checkpoint: b2aa008]
- [x] Task: Run full test suite to ensure no regressions
- [x] Task: Perform final manual check on mobile and desktop views
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Verification and Cleanup' (Protocol in workflow.md)
