# Plan: UI Refinement & Readability Overhaul

## Phase 1: Header & Navigation (ASCII Logo & Unified Row)
- [x] Task: Implement ASCII Logo Component [c1b656c]
    - Create a new component `src/components/dashboard/AsciiLogo.tsx` using a pre-formatted string.
    - Replace the existing grid logo in `src/app/page.tsx` with this component.
    - Ensure it remains the trigger for the `CustomizationMenu`.
- [x] Task: Implement Collapsible Search Bar [8517910]
    - Modify the search input in `src/app/page.tsx` to be collapsible.
    - Use state to toggle between an icon-only view and an expanded input field.
- [x] Task: Unified Header Row Layout [8517910]
    - Re-layout the header in `src/app/page.tsx` to put categories and the search bar in a single `flex` row.
    - Adjust spacing and alignment for a streamlined look.
- [ ] Task: Conductor - User Manual Verification 'Header & Navigation' (Protocol in workflow.md)

## Phase 2: High-Density Grid (Compact Modules)
- [x] Task: Refactor SortableLinkItem for Compactness [a66b158]
    - Update `src/components/dashboard/LinksPane.tsx`.
    - Reduce internal padding, icon size, and font sizes within the link cards.
- [ ] Task: Increase Grid Column Density
    - Update the grid container classes in `src/app/page.tsx` to support more columns on medium and large screens (e.g., `sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10`).
- [ ] Task: Conductor - User Manual Verification 'High-Density Grid' (Protocol in workflow.md)

## Phase 3: Contrast & Readability Polish
- [ ] Task: Global Typography Contrast Update
    - Audit all primary text components (headers, task text, note content).
    - Increase text color opacity/brightness to 90-100% across all themes.
- [ ] Task: Background Contrast Audit
    - Review background transparency in `Pane.tsx` and specific subsystem containers.
    - Ensure backgrounds are dark enough to provide high contrast against terminal-main text.
- [ ] Task: Conductor - User Manual Verification 'Contrast & Readability Polish' (Protocol in workflow.md)

## Phase 4: Final Verification
- [ ] Task: Conductor - User Manual Verification 'UI Refinement & Readability Overhaul' (Protocol in workflow.md)
