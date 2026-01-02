# Track Plan: Dashboard Polish and Advanced Features

## Phase 1: Link Categories and Filtering [checkpoint: 09386df]
- [ ] Task: Update `Link` interface to include a `category` string.
- [x] Task: Update the navigation tabs (6027d66) in `page.tsx` to handle active state and filtering logic.
- [ ] Task: Update the `LinksPane` form to include a category dropdown/input.
- [x] Task: Conductor - User Manual Verification 'Categories and Filtering' (09386df) (Protocol in workflow.md)

## Phase 2: Auto-Favicons and Card Polish [checkpoint: 62c8be1]
- [ ] Task: Create a utility function to generate favicon URLs (using Google S2).
- [ ] Task: Update `SortableLinkItem` to render the favicon as a dimmed background watermark.
- [x] Task: Refine the CSS/SVG transparency (6bbcb7e) for better watermark legibility.
- [x] Task: Conductor - User Manual Verification 'Auto-Favicons' (62c8be1) (Protocol in workflow.md)

## Phase 3: Pomodoro Integration
- [ ] Task: Add `restMode` and `restTimeRemaining` state to `TimersPane`.
- [x] Task: Implement the auto-rest logic (29671f8): transition to countdown when a work session is stopped.
- [x] Task: Update the "REST TIMER" button UI (29671f8) to show active countdown status.
- [ ] Task: Conductor - User Manual Verification 'Pomodoro Integration' (Protocol in workflow.md)
