# Track Spec: Advanced Dashboard Interactivity (Search, Management, and Reordering)

## Overview
This track adds advanced management features to the dashboard. We will implement search/filtering for links, full CRUD (Create, Read, Update, Delete) for links, delete functionality for todos and timers, and drag-and-drop reordering for items within their respective panes.

## Functional Requirements
- **Links Pane Enhancements:**
    - **Search:** A persistent search bar at the top of the Links pane to filter links by title or URL.
    - **Edit:** Ability to edit link title and URL via a hover-action pencil icon.
    - **Delete:** Ability to remove a link via a hover-action trash icon.
- **Management Actions:**
    - **Todo Delete:** A trash icon on hover to remove tasks.
    - **Timer Delete:** A trash icon on each timer project to remove it from the list.
- **Drag-and-Drop Reordering:**
    - Implement vertical reordering for Todo items.
    - Implement reordering for Links (app-icon cards).
    - Implement vertical reordering for Timer projects.
    - Use `dnd-kit` for the implementation.

## Acceptance Criteria
- [ ] Searching in the Links pane updates the visible icons in real-time.
- [ ] Hovering over a link, todo, or timer reveals management icons.
- [ ] Clicking delete removes the item and updates LocalStorage.
- [ ] Editing a link updates its properties and persists the change.
- [ ] Items can be dragged and dropped to new positions, and the new order is persisted.

## Technical Constraints
- Library: `dnd-kit` for reordering logic.
- Persistence: All changes (deletes, edits, new order) must be saved to LocalStorage.
