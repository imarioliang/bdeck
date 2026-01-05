# Specification: Grid View Polish & Interactions

## 1. Overview
Further refine the Retro Grid View by implementing a high-impact "Full Card Hover" effect and improving the clarity and accessibility of core link actions. The goal is to make the entire tile feel interactive while providing a streamlined interface for management.

## 2. Functional Requirements
- **Full Card Inversion:**
    - On hover, the entire grid card should trigger a "Full Inversion" (Main color background, Black text).
    - This ensures the entire tile area feels interactive and consistent with the list view behavior.
- **Center Overlay Action Toolbar:**
    - Replace the bottom-tab action toolbar with a "Center Overlay".
    - On hover, a set of minimalist action buttons will appear in the center of the card.
    - The background content (favicon and title) should be slightly dimmed or blurred to prioritize the actions.
- **Improved Action Buttons:**
    - Use minimalist symbols for actions:
        - **PIN:** `[P]` (or filled/hollow icon variation).
        - **EDIT:** `[E]`.
        - **DELETE:** `[X]` (or semantic Red variation on hover).
    - Buttons must be large enough for reliable interaction but minimalist enough to maintain the terminal aesthetic.

## 3. User Interface & Experience
- **Aesthetic:** High-fidelity Retro terminal. 
- **Interactions:**
    - **Card Hover:** Immediate inversion of background and foreground colors.
    - **Action Reveal:** Buttons appear in the center with a subtle fade-in or scaling effect.
    - **Button Hover:** Inversion within the inverted state (Black background, Main color text) to clearly highlight the selected action.

## 4. Technical Considerations
- **Component Refactoring:** Update `SortableLinkItem` in `LinksPane.tsx`.
- **CSS Transitions:** Ensure smooth transitions for the inversion and the reveal of the center overlay.
- **Z-Index Management:** Ensure the center overlay and drag handles are correctly layered.

## 5. Acceptance Criteria
- [ ] Hovering anywhere on a grid card triggers a full color inversion.
- [ ] minimalist action buttons `[P]`, `[E]`, `[X]` appear in the card center on hover.
- [ ] Icons and title are still readable but secondary when the overlay is active.
- [ ] All management actions (Pin, Edit, Delete) function correctly.
