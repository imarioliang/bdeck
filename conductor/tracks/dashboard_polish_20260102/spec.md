# Track Spec: Dashboard Polish and Advanced Features

## Overview
This track focuses on enhancing the dashboard with automated favicons for links, category management, and a Pomodoro-style integration for project timers.

## Functional Requirements
- **Links Pane Polish:**
    - **Auto Favicons:** Implement a system to automatically fetch and display favicons for all links.
    - **Favicon Display:** The favicon will be displayed as a dimmed background watermark on each app card.
    - **Category Filtering:** Connect the existing navigation tabs (ALL SYSTEMS, etc.) to filter the links grid.
    - **Category Management:** Allow users to assign categories to links via the Add/Edit form and create new categories.
- **Timers Pane Polish:**
    - **Pomodoro Integration:** Integrate Pomodoro logic into the "REST TIMER" function.
    - **Auto-Break:** When a work timer finishes (or a session is manually ended), the "REST TIMER" should automatically trigger a break countdown.
- **Visual Polish:**
    - Ensure all new elements (categories, favicons) adhere to the high-density Retro-Terminal aesthetic.

## Acceptance Criteria
- [ ] Links cards show a dimmed favicon background based on their URL.
- [ ] Clicking different navigation tabs (e.g., DEVELOPMENT) filters the link grid.
- [ ] The Add/Edit link form includes a category selector.
- [ ] Ending a work session triggers a configurable "REST" countdown in the Timers pane.
- [ ] All new data points (categories, favicon settings) persist to LocalStorage.

## Out of Scope
- Server-side favicon proxy (will use client-side Google Favicon service).
- Complex analytics for the Pomodoro sessions.
