# Track Plan: Retro Skin UI Improvement

## Phase 1: Typography & Global Aesthetic [checkpoint: 5e5de3c]
- [x] Task: Update Global Fonts. (7994abd)
    - [x] Import `Press Start 2P` from Next.js Google Fonts in `src/app/layout.tsx`.
    - [x] Update `src/app/globals.css` to use `Press Start 2P` for the `retro` skin.
    - [x] Add CSS to disable `antialiased` font smoothing specifically for `data-skin='retro'`.
- [x] Task: Conductor - User Manual Verification 'Typography & Global Aesthetic' (Protocol in workflow.md) (7994abd)

## Phase 2: Links Pane Transformation (Grid to List) [checkpoint: a981be6]
- [x] Task: Refactor `LinksPane` for Skin-Based Layout. (1c81495, 9ed3f15)
    - [x] Modify `src/components/dashboard/LinksPane.tsx` to switch from a grid to a list/table structure when in retro mode.
    - [x] Implement the `FILENAME` and `STATUS` column headers.
- [x] Task: Update `SortableLinkItem` for List Rendering. (1c81495, 9ed3f15)
    - [x] Update the component to render as a table row or a full-width list item when `isRetro` is true.
    - [x] Ensure drag-and-drop functionality persists in the list view.
- [x] Task: Update `LinksPane` Tests. (1c81495)
    - [x] Update `src/components/dashboard/LinksPane.test.tsx` to verify list-style rendering in retro mode.
- [x] Task: Conductor - User Manual Verification 'Links Pane Transformation' (Protocol in workflow.md) (9ed3f15)

## Phase 3: UI Refinements (Timers & Todo) [checkpoint: ace579f]
- [x] Task: Rename and Style Timers Rest Button. (d02e073)
    - [x] Update `src/components/dashboard/TimersPane.tsx` to change `[ RESET_ALL_PROCESSES ]` to `[ INITIATE_REST_PROTOCOL ]`.
    - [x] Ensure button styling aligns with the mockup's high-contrast, bordered look.
- [x] Task: Refine Todo Input Bar. (d02e073)
    - [x] Modify `src/components/dashboard/TodoPane.tsx` to match the mockup: `> add_objective... [ENT]`.
- [x] Task: Update Component Tests. (d02e073)
    - [x] Update `TimersPane.test.tsx` and `TodoPane.test.tsx` to reflect the new labels and placeholders.
- [x] Task: Conductor - User Manual Verification 'UI Refinements' (Protocol in workflow.md) (d02e073)

## Phase 4: Final Visual Audit
- [ ] Task: Mobile Responsiveness Check.
    - [ ] Verify that the new Links list layout doesn't break on narrow screens.
- [ ] Task: Final Contrast & Alignment Tweak.
    - [ ] Audit all retro elements against the mockup for alignment and high-contrast consistency.
- [ ] Task: Conductor - User Manual Verification 'Final Visual Audit' (Protocol in workflow.md)
