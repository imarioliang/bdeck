# Specification: Small UX Improvements & Indicators

## 1. Overview
This track implements a collection of small features and UX refinements to improve the overall dashboard experience. These include inline editing for timers, global sync status visibility, and developer-oriented environment indicators.

## 2. Functional Requirements

### 2.1 Inline Timer Name Editing
- **Mechanism:** Clicking on a timer's name in the `TimersPane` will transform the text into an input field.
- **Save Actions:** The name update will be committed when the user presses `Enter` or when the input loses focus (`onBlur`).
- **Persistence:** Changes must update the local store and trigger a cloud sync via `SyncManager`.

### 2.2 Global Sync Status Indicator
- **Location:** Integrated into the Global Header (near the "Command Center" title).
- **Appearance:** A combined icon and text label (e.g., `● SYNC_OK` or `⟳ TRANSMITTING...`).
- **States:**
    - **Idle/Synced:** Static green indicator with `SYNC_OK`.
    - **Active:** Pulsing/Rotating icon with `TRANSMITTING...` when a push or pull is in progress.
    - **Error:** Red indicator with `SYNC_ERR` if a network error occurs.

### 2.3 Environment & Branch Indicator (Dev Only)
- **Visibility:** Only visible when `process.env.NODE_ENV === 'development'`.
- **Location:** Global Header, subtle placement.
- **Content:** Displays the current active Git branch (e.g., `DEV_BRANCH: addLogin`).

### 2.4 Keyboard UX: Link Modal
- **Improvement:** In the "Initialize Module" (Add Link) modal, pressing the `Enter` key while any input field is focused will trigger the "Execute" (Save) action.

## 3. Acceptance Criteria
- [ ] Clicking a timer name allows typing; pressing Enter saves the new name.
- [ ] A sync indicator appears in the header and reflects active/synced states during data changes.
- [ ] The current git branch is visible in the header only during local development.
- [ ] Adding a link can be completed entirely via keyboard by pressing Enter in the modal inputs.

## 4. Out of Scope
- Dynamic favicon discovery (improve fallback logic).
- Advanced reordering for timers.
