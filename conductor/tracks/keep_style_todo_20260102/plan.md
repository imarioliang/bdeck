# Track Plan: Google Keep Style Todo and Pinned Links

## Phase 1: Links Pinning Functionality
- [ ] Task: Update the `Link` interface to include an `isPinned` property.
- [x] Task: Implement the pin icon (7e919ec) and toggle logic in `LinksPane`.
- [x] Task: Update the sorting logic (7e919ec) to ensure pinned links stay at the top.
- [ ] Task: Conductor - User Manual Verification 'Links Pinning' (Protocol in workflow.md)

## Phase 2: Google Keep Style Todo List (Core)
- [ ] Task: Update the `Todo` interface to include `level` (0 for task, 1 for subtask).
- [ ] Task: Refactor `TodoPane` to remove the separate "Add" input.
- [ ] Task: Implement inline editing for each task text.
- [ ] Task: Implement "Enter" to create new lines and "Backspace" to remove empty lines.
- [ ] Task: Conductor - User Manual Verification 'Todo Core Interaction' (Protocol in workflow.md)

## Phase 3: Todo Subtasks and Persistence
- [ ] Task: Implement `Tab` and `Shift+Tab` logic for indenting/outdenting tasks.
- [ ] Task: Ensure the blank line at the bottom is always present.
- [ ] Task: Verify that nesting and all text changes persist to LocalStorage.
- [ ] Task: Conductor - User Manual Verification 'Todo Subtasks and Final Polish' (Protocol in workflow.md)
