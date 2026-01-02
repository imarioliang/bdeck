# Track Spec: Google Keep Style Todo and Pinned Links

## Overview
This track refactors the Todo List to behave like Google Keep's checklist and adds pinning functionality to the Links pane.

## Functional Requirements
- **Google Keep Style Todo List:**
    - **No "Add" Button:** Remove the separate input field and button.
    - **Inline Editing:** All tasks are editable text fields.
    - **Blank Task Entry:** Always maintain at least one empty task line at the end of the list.
    - **Enter to Add:** Pressing `Enter` in a task field creates a new blank task line below it.
    - **Tab for Subtasks:** Pressing `Tab` indents a task to become a subtask (max 1 level of nesting). `Shift+Tab` outdents.
    - **Backspace to Delete:** Pressing `Backspace` on an empty task line deletes the line and moves focus up.
- **Pinned Links:**
    - **Pin Action:** Add a "Pin" icon to each link card (visible on hover).
    - **Priority Sorting:** Pinned links are always moved to the top of the grid.
    - **Visual Indicator:** Pinned links show a persistent pin icon.

## Acceptance Criteria
- [ ] Todo list allows creating tasks and subtasks using only the keyboard (`Enter`, `Tab`).
- [ ] The Todo list always has a blank line for new entries.
- [ ] Links can be pinned and unpinned.
- [ ] Pinned links appear at the start of the list.
- [ ] All states (nested todos, pin status) persist to LocalStorage.

## Technical Constraints
- Continue using `useLocalStorage`.
- Maintain `dnd-kit` support for reordering (indented subtasks move with their parent or independently?). *Decision: For this iteration, reordering will be simple flat-list reordering to keep implementation focused.*
