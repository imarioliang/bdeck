# Specification: UI Refinement & Readability Overhaul

## 1. Overview
This track focuses on streamlining the dashboard layout and significantly improving readability. Key changes include merging the category navigation and search into a single row, implementing a compact high-density grid for link cards, and replacing the system logo with a stylized ASCII-art menu trigger.

## 2. Functional Requirements

### 2.1 Unified Navigation Row
- **Layout:** Categories tabs (left) and Search Bar (right) will occupy a single horizontal row within the main container header.
- **Search Behavior:** The search bar will be collapsible, starting as an icon and expanding to fill available space when activated.
- **Responsiveness:** Ensure tabs and search wrap or adapt gracefully on smaller viewports.

### 2.2 High-Density Link Cards
- **Grid Density:** Increase the standard column count (e.g., from 7 to 9 or 10 on large screens).
- **Component Compactness:** Reduce internal padding and font sizes (headers, status text) within the `SortableLinkItem` to allow for more modules at a glance.
- **Visuals:** Maintain the favicon watermark but scale it down proportionally.

### 2.3 ASCII Art System Logo
- **Component:** Replace the current grid-based "Command Center" logo with a stylized ASCII-art string (e.g., `[ BDECK ]` or a multi-line small art piece).
- **Interaction:** The ASCII art serves as the primary trigger for the `CustomizationMenu` (System Config).
- **Styling:** Use a high-contrast glow effect to ensure it looks modern despite the retro font style.

### 2.4 Contrast & Readability Improvements
- **Typography:** Increase the opacity of primary text throughout the app (from current muted levels to 90-100% opacity).
- **Accessibility:** Audit background colors behind text panes (Todos, Timers, Notes) to ensure they meet higher contrast standards against the terminal-main colors.

## 3. Acceptance Criteria
- [ ] Category tabs and search bar reside in the same row.
- [ ] Search bar successfully collapses and expands within the header row.
- [ ] Link cards are visibly smaller, and more fit on a single row.
- [ ] The dashboard logo is rendered as ASCII art and triggers the config menu.
- [ ] Text is significantly easier to read across all dashboard panes.

## 4. Out of Scope
- Redesigning the `CustomizationMenu` internals.
- Adding new data types or subsystems.
