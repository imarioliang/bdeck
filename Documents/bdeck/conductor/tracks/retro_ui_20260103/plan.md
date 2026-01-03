# Track Plan: Retro Skin UI Improvement

## Phase 1: Typography & Global Aesthetic
- [x] Task: Update Global Fonts. (88c177a)
    - [ ] Import `Press Start 2P` from Next.js Google Fonts in `src/app/layout.tsx`.
    - [ ] Update `src/app/globals.css` to use `Press Start 2P` for the `retro` skin.
    - [ ] Add CSS to disable `antialiased` font smoothing specifically for `data-skin='retro'`.
- [ ] Task: Conductor - User Manual Verification 'Typography & Global Aesthetic' (Protocol in workflow.md)

## Phase 2: Links Pane Transformation (Grid to List)
- [ ] Task: Refactor `LinksPane` for Skin-Based Layout.
    - [ ] Modify `src/components/dashboard/LinksPane.tsx` to switch from a grid to a list/table structure when in retro mode.
    - [ ] Implement the `FILENAME` and `STATUS` column headers.
- [ ] Task: Update `SortableLinkItem` for List Rendering.
    - [ ] Update the component to render as a table row or a full-width list item when `isRetro` is true.
    - [ ] Ensure drag-and-drop functionality persists in the list view.
- [ ] Task: Update `LinksPane` Tests.
    - [ ] Update `src/components/dashboard/LinksPane.test.tsx` to verify list-style rendering in retro mode.
- [ ] Task: Conductor - User Manual Verification 'Links Pane Transformation' (Protocol in workflow.md)

## Phase 3: UI Refinements (Timers & Todo)
- [ ] Task: Rename and Style Timers Rest Button.
    - [ ] Update `src/components/dashboard/TimersPane.tsx` to change `[ RESET_ALL_PROCESSES ]` to `[ INITIATE_REST_PROTOCOL ]`.
    - [ ] Ensure button styling aligns with the mockup's high-contrast, bordered look.
- [ ] Task: Refine Todo Input Bar.
    - [ ] Modify `src/components/dashboard/TodoPane.tsx` to match the mockup: `> add_objective... [ENT]`.
- [ ] Task: Update Component Tests.
    - [ ] Update `TimersPane.test.tsx` and `TodoPane.test.tsx` to reflect the new labels and placeholders.
- [ ] Task: Conductor - User Manual Verification 'UI Refinements' (Protocol in workflow.md)

## Phase 4: Final Visual Audit
- [ ] Task: Mobile Responsiveness Check.
    - [ ] Verify that the new Links list layout doesn't break on narrow screens.
- [ ] Task: Final Contrast & Alignment Tweak.
    - [ ] Audit all retro elements against the mockup for alignment and high-contrast consistency.
- [ ] Task: Conductor - User Manual Verification 'Final Visual Audit' (Protocol in workflow.md)
