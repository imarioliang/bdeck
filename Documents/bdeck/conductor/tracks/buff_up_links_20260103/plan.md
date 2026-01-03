# Track Plan: Buff Up Links & Tag Functions

## Phase 1: Tag Data Model & Modal Update
- [x] Task: Create Tests for Tag Data Model. (f019cc1)
- [x] Task: Update `Link` Type and Modal UI. (f019cc1)
    - [x] Update `Link` interface in `src/components/dashboard/LinksPane.tsx`.
    - [x] Implement comma-separated tag input in the "Modify Module" modal.
    - [x] Ensure tags are saved/loaded correctly via `useLocalStorage`.
- [~] Task: Conductor - User Manual Verification 'Tag Data Model & Modal Update' (Protocol in workflow.md)

## Phase 2: Dynamic Columns (EXT & SIZE)
- [x] Task: Create Tests for Dynamic Columns. (f019cc1)
- [x] Task: Implement Category Shorthand (EXT). (f019cc1)
- [x] Task: Implement Tag Display (SIZE). (f019cc1)
- [~] Task: Conductor - User Manual Verification 'Dynamic Columns' (Protocol in workflow.md)

## Phase 3: Tag Navigation in Sidebar
- [x] Task: Create Tests for Tag Navigation. (0ef4207)
- [x] Task: Update Sidebar for Tag Display. (0ef4207)
- [x] Task: Implement Tag Filtering Logic. (0ef4207)
- [x] Task: Conductor - User Manual Verification 'Tag Navigation' (Protocol in workflow.md) (724e791)

## Phase 4: Visual Scaling & Polish
- [x] Task: Create Tests for Visual Scaling. (dc7d19f)
- [x] Task: Scale Link Row Typography. (dc7d19f)
- [~] Task: Conductor - User Manual Verification 'Visual Scaling & Polish' (Protocol in workflow.md)

## Phase 5: Glitch Hover Animations
- [ ] Task: Create Tests for Hover Animations.
    - [ ] Verify animation trigger and keyframe existence in CSS.
- [ ] Task: Implement Glitch Keyframes in `globals.css`.
    - [ ] Define `shake` and `scale-glitch` animations.
- [ ] Task: Apply Animations to Sidebar and Links.
    - [ ] Update `DirectoriesSidebar.tsx` and `LinksPane.tsx` to trigger animations on hover.
- [ ] Task: Conductor - User Manual Verification 'Glitch Hover Animations' (Protocol in workflow.md)
