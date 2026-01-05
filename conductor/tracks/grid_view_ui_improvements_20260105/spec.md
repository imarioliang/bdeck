# Specification: Grid View UI Improvements

## 1. Overview
Refine the newly implemented Retro Grid View to enhance usability, information density, and aesthetic polish. The goal is to move from a basic "bordered box" to a "Balanced Card" layout that provides clear identification, easy access to actions, and persistent metadata without cluttering the interface.

## 2. Functional Requirements
- **Balanced Card Layout:**
    - Update the grid tile dimensions to be more versatile (e.g., maintaining a square or slightly vertical aspect).
    - Increase internal padding consistency.
- **Icon/Favicon Enhancement:**
    - Increase default favicon size (e.g., from 24px to 32px where space permits).
    - Improve fallback icon contrast and centering.
- **Subtle Action Toolbar:**
    - Replace the full-tile hover overlay with a localized toolbar.
    - Actions (PIN, EDIT, DEL) should appear as a small row of minimalist buttons (e.g., at the top or bottom of the card) on hover.
    - The link's title and icon must remain visible while the toolbar is active.
- **Metadata Footer:**
    - Implement a dedicated footer area within each card.
    - Display the category shorthand (`.EXT`) and the first active tag.
    - This row should be visually distinct (e.g., dimmed text or a subtle separator line).
- **Responsive Alignment:**
    - Ensure the grid columns adjust smoothly across different viewport sizes while maintaining the card's integrity.

## 3. User Interface & Experience
- **Aesthetic:** High-fidelity Retro terminal. Strict 1px borders using `border-terminal-main/30`.
- **Interactions:**
    - Card hover: Subtle border highlight or background shift.
    - Action hover: Standard retro inversion for the specific button.
- **Typography:** Use `Press Start 2P` for the primary title and `VT323` for the metadata footer to maximize readability at small scales.

## 4. Technical Considerations
- **Component Refactoring:** Update `SortableLinkItem` within `LinksPane.tsx` to implement the new sub-sections (Header/Body/Footer).
- **CSS Grid:** Refine the Tailwind grid classes (`grid-cols-X`) to ensure card aspect ratios remain pleasing.

## 5. Acceptance Criteria
- [ ] Links grid displays "Balanced Cards" with a clear Title/Icon/Footer structure.
- [ ] Favicons/Icons are larger and centered.
- [ ] Actions toolbar appears on hover without obscuring the primary link identity.
- [ ] Category and tags are visible in the card footer.
- [ ] Hover inversion and 1px borders are maintained according to project guidelines.
