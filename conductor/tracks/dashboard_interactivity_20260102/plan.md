# Track Plan: Implement Dashboard Interactivity

## Phase 1: Shared Storage Logic
- [ ] Task: Create a custom React hook `useLocalStorage` to handle persistent state for all components.
- [x] Task: Write unit tests for `useLocalStorage` (5a37220) to verify data saving and retrieval.
- [ ] Task: Conductor - User Manual Verification 'Shared Storage Logic' (Protocol in workflow.md)

## Phase 2: Todo List Implementation
- [ ] Task: Write tests for `TodoPane` logic (adding items, toggling completion).
- [ ] Task: Implement the add/toggle logic in `TodoPane` using `useLocalStorage`.
- [ ] Task: Update the UI to reflect completion status with the "Brutalist" style (strikethrough).
- [ ] Task: Conductor - User Manual Verification 'Todo List Implementation' (Protocol in workflow.md)

## Phase 3: Links Pane Implementation
- [ ] Task: Write tests for `LinksPane` logic (adding new links, URL validation).
- [ ] Task: Implement the inline "Add Link" row and persistence logic in `LinksPane`.
- [ ] Task: Ensure newly added links are clickable and open in a new tab.
- [ ] Task: Conductor - User Manual Verification 'Links Pane Implementation' (Protocol in workflow.md)

## Phase 4: Multi-Project Concurrent Timers
- [ ] Task: Write tests for timer logic (independent counting, persistence).
- [ ] Task: Implement the `TimersPane` logic to support an arbitrary number of concurrent timers.
- [ ] Task: Add the ability to name a new project and initialize its timer.
- [ ] Task: Conductor - User Manual Verification 'Multi-Project Concurrent Timers' (Protocol in workflow.md)
