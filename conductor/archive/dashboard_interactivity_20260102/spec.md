# Track Spec: Implement Dashboard Interactivity

## Overview
This track focuses on transforming the placeholder dashboard panes into functional tools. Specifically, we will implement the logic for adding/checking tasks in the Todo List, adding new bookmarks in the Links pane, and managing multiple concurrent timers for different projects.

## Functional Requirements
- **Todo List Interactivity:**
    - Users can add new tasks via an "Add" button and input field.
    - Users can toggle the "done" status of a task.
    - Data must be persisted to Local Storage.
- **Links Pane Interactivity:**
    - Users can add new links via an inline editing interface.
    - Each link requires a title and a valid URL.
    - Data must be persisted to Local Storage.
- **Multi-Project Concurrent Timers:**
    - Users can create multiple project-specific timers.
    - Multiple timers can run concurrently.
    - Each timer has "Start", "Pause", and "Reset" controls.
    - Timer data (current time and project name) must be persisted to Local Storage to survive refreshes.

## Acceptance Criteria
- [ ] New todo items appear in the list and survive browser refresh.
- [ ] Checking/unchecking a todo item persists its state.
- [ ] New links can be added and clicked to open the target URL.
- [ ] Multiple timers can be started, and each tracks time independently.
- [ ] Refreshing the page does not reset the timers or delete the project list.

## Out of Scope
- Cloud synchronization (Supabase sync).
- Advanced timer features like sound notifications or history logs.
- Deleting links or todos (to keep this iteration focused).
