# Track Plan: Advanced Dashboard Interactivity

## Phase 1: Environment and Search Setup [checkpoint: a4ae94b]
- [x] Task: Install `dnd-kit` (29ee884) dependencies (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`).
- [x] Task: Write tests for search (d02ce68) and filtering in `LinksPane`.
- [x] Task: Implement search input (d02ce68) in the Links header and filter logic for link cards.
- [x] Task: Conductor - User Manual Verification 'Environment and Search Setup' (a4ae94b) (Protocol in workflow.md)

## Phase 2: CRUD Operations [checkpoint: 5faf944] (Delete & Edit)
- [x] Task: Write tests for item deletion (f5f17bc) in `TodoPane`, `LinksPane`, and `TimersPane`.
- [x] Task: Implement hover management icons (f5f17bc) (trash icon) for all three panes and the edit icon for Links.
- [x] Task: Implement the logic to remove items (f5f17bc) and update LocalStorage state.
- [x] Task: Implement the link editing form (f5f17bc)/modal logic.
- [x] Task: Conductor - User Manual Verification 'CRUD Operations' (5faf944) (Protocol in workflow.md)

## Phase 3: Drag and Drop Implementation [checkpoint: 3f548b2]
- [x] Task: Implement sortable reordering for the `TodoPane` (3f548b2) list.
- [x] Task: Implement sortable reordering for the `LinksPane` (3f548b2) grid icons.
- [x] Task: Implement sortable reordering for the `TimersPane` (3f548b2) project list.
- [x] Task: Ensure the new order of items is persisted (3f548b2) to LocalStorage after a drop event.
- [x] Task: Conductor - User Manual Verification 'Drag and Drop' (3f548b2) (Protocol in workflow.md)
