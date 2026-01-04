# Track Spec: App Polish and Advanced Productivity Features

## Overview
This track focuses on refining the user experience and adding advanced productivity features, including an improved Link grid with integrated search/sort, auto-favicons, and a Pomodoro timer with audible alerts.

## Functional Requirements
- **Links Pane Polish:**
    - **Header Consolidation:** Move the search input and sort controls into a single row within the Links pane header.
    - **Auto Favicons:** Automatically fetch and display site favicons as subtle background watermarks on app cards.
    - **Category Management:** Implement a hybrid category selector (dropdown + custom input) in the Add/Edit form.
- **Timers Pane Polish:**
    - **Pomodoro Alarm:** Implement a staggered audible alert (every 5 seconds) when a work timer exceeds the configured limit.
    - **Manual Limit Toggle:** Allow users to toggle the work/rest limit "off" to use standard stopwatch functionality.
- **Visual Refinements:**
    - Further tighten spacing and typography to ensure perfect alignment with the high-density aesthetic.

## Acceptance Criteria
- [ ] Links header contains search and sort controls in a single compact row.
- [ ] Link cards display a subtle favicon watermark with a fallback to generic icons.
- [ ] New categories can be added via the link form and appear in the filter tabs.
- [ ] Timers beep every 5 seconds when over the limit, unless the limit is toggled off.
- [ ] Users can disable the session limit to use the timer as a simple counter.

## Out of Scope
- Implementing a full backend for link scraping (will continue using Google S2 Favicon API).
- Multi-track audio management.
