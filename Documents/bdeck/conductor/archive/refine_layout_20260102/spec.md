# Track Spec: Refine Dashboard Layout and Styling

## Overview
This track focuses on structural and aesthetic refinements to the dashboard layout. We will integrate "Add" functionality into the headers, promote the Links pane to a full-width row, and remove height constraints to allow panels to expand with their content.

## Functional Requirements
- **Integrated Header Inputs:**
    - Move "Add" buttons and associated input fields from the bottom to the top of each pane.
    - Integrate inputs directly into the header area or immediately below it.
- **Full-Width Links Pane:**
    - Update the grid layout so the Links pane (01_Links) spans the full 12-column width at the top of the dashboard.
- **Dynamic Panel Height:**
    - Remove fixed height constraints (e.g., `h-[calc(100vh-2rem)]`, `h-1/3`, `h-1/2`).
    - Panels should expand indefinitely based on the amount of content they contain.
    - The main page will scroll vertically if the total content exceeds the viewport.

## Acceptance Criteria
- [ ] The Links pane is at the top and spans the full width of the container.
- [ ] All "Add" controls (inputs and buttons) are located at the top of their respective panes.
- [ ] Panes grow vertically as items (todos, links, projects) are added.
- [ ] The dashboard is no longer restricted to a single screen height; it scrolls naturally.

## Out of Scope
- Adding new functional features (logic for timers, etc.).
- Changing the "Brutalist" visual style (colors, borders, etc.).
