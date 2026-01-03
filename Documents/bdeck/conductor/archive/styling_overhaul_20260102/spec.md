# Track Spec: Styling Overhaul (Command Center)

## Overview
This track transforms the Bdeck dashboard from a light Brutalist aesthetic to a dark, retro-terminal "Command Center" aesthetic based on a user-provided mockup.

## Functional Requirements
- **Theme:** Implement a deep dark background (#0a0a0a) with amber (#ff9d00) and green accents.
- **Header:** Implement a "Command Center" header with a pulse icon and search modules input.
- **Navigation:** Add retro-style navigation tabs (ALL SYSTEMS, DEVELOPMENT, etc.).
- **App Grid:** Refactor link cards into high-density aspect-square cards with category-specific icons.
- **Panes:** Update the dashboard panes (Timers, Todo, Notes) to match the dark terminal aesthetic with glowing pulse indicators.
- **Todo:** Integrate "Add New Objective" bar at the top of the Todo list.
- **Timers:** Implement "Universal Reset" and project-specific start/stop/reset controls in the new style.
- **Notes:** Add a code-editor style interface with line numbers.

## Acceptance Criteria
- [ ] Visual design matches screen.png mockup.
- [ ] Responsive grid layout for app icons and bottom panels.
- [ ] Existing functionality (CRUD for links/todos/timers) is preserved.
- [ ] All tests pass with updated DOM structures.
