# Track Specification: Retro Skin UI Improvement

## 1. Overview
Refine the "Retro Terminal" skin to more closely match the provided mockup (`mock2.png`). This includes a major layout shift for the Links pane, a font swap, and UI text refinements to align with the "System Terminal" theme.

## 2. Functional & Visual Requirements
- **Typography:**
  - Replace the current retro font (`VT323`) with `Press Start 2P` for a more authentic 8-bit pixel aesthetic.
  - Disable font-smoothing (`antialiased`) globally when the Retro skin is active to ensure crisp pixels.

- **Links Pane (List Menu Transformation):**
  - In Retro mode, change the Links display from a square grid to a vertical list (table-like menu).
  - Columns:
    - `FILENAME`: The link title (e.g., `MAIL_CLIENT`).
    - `STATUS`: The dynamic status text (e.g., `INBOX:0`, `PAUSED`).
  - Style: Use a header row with column labels and 1px borders between rows.

- **Timers Pane (Rest Protocol):**
  - Rename the primary action button from `[ RESET_ALL_PROCESSES ]` to `[ INITIATE_REST_PROTOCOL ]` or simply `[ REST_TIMER ]` to clarify that it starts the rest timer rather than wiping data.
  - Ensure the styling matches the mockup's button format.

- **Mission Control (Todo List):**
  - Refine the input bar styling to match the mockup exactly: `> add_objective... [ENT]`.
  - Ensure the "Add" indicator (`>`) and the action indicator (`[ENT]`) are clearly visible.

## 3. Non-Functional Requirements
- **Responsive List:** The new Links list layout must remain readable on mobile, possibly collapsing columns or reducing padding.
- **Modern Skin Integrity:** These changes must remain scoped to `data-skin='retro'` and not affect the "Modern" skin.

## 4. Acceptance Criteria
- [ ] Global font changes to `Press Start 2P` when Retro skin is selected.
- [ ] Links appear as a list menu with columns instead of a grid in Retro mode.
- [ ] The "Reset" button in Timers is correctly labeled as a Rest action.
- [ ] The Todo input matches the mockup styling.

## 5. Out of Scope
- Implementing actual file system metadata (real file sizes or extensions). Data remains simulated/placeholder.
