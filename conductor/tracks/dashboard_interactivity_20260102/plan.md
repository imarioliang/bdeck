# Track Plan: Implement Dashboard Interactivity

## Phase 1: Shared Storage Logic [checkpoint: ede7b33]
- [ ] Task: Create a custom React hook `useLocalStorage` to handle persistent state for all components.
- [x] Task: Write unit tests for `useLocalStorage` (5a37220) to verify data saving and retrieval.
- [x] Task: Conductor - User Manual Verification 'Shared Storage Logic' (ede7b33) (Protocol in workflow.md)

## Phase 2: Todo List Implementation [checkpoint: 9b107f7]
- [ ] Task: Write tests for `TodoPane` logic (adding items, toggling completion).
- [x] Task: Implement the add/toggle logic (a8a3168) in `TodoPane` using `useLocalStorage`.
- [x] Task: Update the UI to reflect completion status (a8a3168) with the "Brutalist" style (strikethrough).
- [x] Task: Conductor - User Manual Verification 'Todo List Implementation' (9b107f7) (Protocol in workflow.md)

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
