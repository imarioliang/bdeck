# Track Plan: Advanced Dashboard Interactivity

## Phase 1: Environment and Search Setup
- [x] Task: Install `dnd-kit` (29ee884) dependencies (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`).
- [ ] Task: Write tests for search and filtering in `LinksPane`.
- [ ] Task: Implement search input in the Links header and filter logic for link cards.
- [ ] Task: Conductor - User Manual Verification 'Environment and Search Setup' (Protocol in workflow.md)

## Phase 2: CRUD Operations (Delete & Edit)
- [ ] Task: Write tests for item deletion in `TodoPane`, `LinksPane`, and `TimersPane`.
- [ ] Task: Implement hover management icons (trash icon) for all three panes and the edit icon for Links.
- [ ] Task: Implement the logic to remove items and update LocalStorage state.
- [ ] Task: Implement the link editing form/modal logic.
- [ ] Task: Conductor - User Manual Verification 'CRUD Operations' (Protocol in workflow.md)

## Phase 3: Drag and Drop Implementation
- [ ] Task: Implement sortable reordering for the `TodoPane` list.
- [ ] Task: Implement sortable reordering for the `LinksPane` grid icons.
- [ ] Task: Implement sortable reordering for the `TimersPane` project list.
- [ ] Task: Ensure the new order of items is persisted to LocalStorage after a drop event.
- [ ] Task: Conductor - User Manual Verification 'Drag and Drop' (Protocol in workflow.md)
