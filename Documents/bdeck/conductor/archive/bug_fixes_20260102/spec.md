# Track Spec: Bug Fixes - Links, Timers, and React Keys

## Overview
This track addresses several regressions and console warnings: the unresponsive "Stop" button in Timers, the non-functional "Edit" action in Links, and the missing/duplicate "key" props in the Todo list.

## Functional Requirements
- **Timers Pane Fix:**
    - Restore functionality to the "Stop" button so users can pause active timers.
    - Ensure the logic correctly clears intervals when "Stop" is clicked.
- **Links Pane Fix:**
    - Restore functionality to the "Edit" (pencil) icon so it correctly reveals the "Edit Link" form.
    - Ensure the form is populated with the correct link data when opened.
- **Todo List Fix:**
    - Resolve the `Each child in a list should have a unique "key" prop` warning in the Todo list.
    - Ensure all items in the reorderable list have persistent, unique keys.

## Acceptance Criteria
- [ ] Clicking "Stop" on an active timer successfully pauses the countdown.
- [ ] Clicking the "Edit" icon on a link card reveals the edit form with pre-filled title and URL.
- [ ] No "unique key" warnings appear in the console when interacting with the Todo list.
- [ ] All fixes are verified with unit tests.

## Out of Scope
- Adding new features or layout changes.
- Performance optimizations beyond what is necessary for the fixes.
