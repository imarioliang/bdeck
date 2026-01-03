# Track Spec: KBAR, Shortcuts, and Customization Menu

## Overview
This track implements global navigation via KBAR, quick-access keyboard shortcuts, and a customization menu accessible by clicking the Command Center logo. It enhances the power-user experience by providing faster control over the dashboard and aesthetic personalization.

## Functional Requirements
- **Command Palette (KBAR)**:
    - Triggered by `Cmd+K` or `Ctrl+K`.
    - Includes actions to switch between navigation tabs (ALL SYSTEMS, DEVELOPMENT, etc.).
    - Visual design must match the Retro-Terminal aesthetic.
- **Customization Menu (Logo Bar)**:
    - Click the "Command Center" logo to open a side menu or overlay.
    - **Theme Selector**: Switch between Terminal Amber, Terminal Green, and Terminal Blue.
    - **Font Size Selector**: Global scaling of the UI text (Small, Standard, Large).
    - **Data Management**:
        - Export settings and links to a JSON file.
        - Reset all LocalStorage data (with confirmation).
- **Keyboard Shortcuts**:
    - `p`: Toggle/Focus the Timers pane.
    - `n`: Focus the Data Log (Notes) editor.
    - `t`: Focus the Mission Objectives (Todo) input.
    - `1-5`: Switch to corresponding navigation tabs.

## Acceptance Criteria
- [ ] KBAR opens and successfully switches navigation tabs.
- [ ] Clicking the logo reveals the customization menu.
- [ ] Theme changes apply globally across all panes and borders.
- [ ] Font size selector scales the dashboard UI correctly.
- [ ] Keyboard shortcuts `p`, `n`, `t` perform their respective actions instantly.
- [ ] Data export generates a valid JSON file.

## Technical Constraints
- Use `kbar` library for the command palette.
- Theme state managed via Zustand.
