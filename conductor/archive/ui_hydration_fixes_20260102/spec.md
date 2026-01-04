# Specification: Fix Hydration, Categories UI, and Theme/Font Toggles

## Overview
This track aims to resolve critical bugs affecting the application's stability and usability. Specifically, we need to fix a hydration error that is causing the Links Categories UI to break (misalignment/styling issues) and preventing the Theme and Font Size toggles from functioning correctly.

## Problem Description
- **Console Error:** "Hydration failed" or "Text content does not match server-rendered HTML".
- **Visual Regression:** Links categories are overlapping, misaligned, or have broken styling.
- **Functional Regression:** Clicking the Theme or Font Size toggles has no effect.

## Root Cause Analysis (Hypothesis)
The root cause is likely a mismatch between the server-rendered HTML and the client-side initial render. This often happens when:
1.  UI components render based on `localStorage` (Theme/Font Size) directly in the initial pass, which differs from the server (which doesn't have access to `localStorage`).
2.  This mismatch causes React to bail out of hydration, leaving the DOM in an inconsistent state, breaking the layout (Categories UI) and event listeners (Toggles).

## Functional Requirements
1.  **Fix Hydration Error:** Ensure the initial client render matches the server render.
    -   *Approach:* Use a `useEffect` hook to handle client-only rendering for state dependent on `localStorage`, or use a "mounted" state check to delay rendering sensitive parts until the client has mounted.
2.  **Restore Links Categories UI:** Ensure the categories are properly aligned and styled once the hydration issue is resolved.
3.  **Restore Theme Functionality:** The theme toggle must switch between modes and persist the choice without causing hydration errors.
4.  **Restore Font Size Functionality:** The font size toggle must adjust text size and persist without causing hydration errors.

## Acceptance Criteria
- [ ] **Console:** No "Hydration failed" or "Text content does not match" errors appear in the browser console upon page load.
- [ ] **Visual:** The Links Categories section displays correctly with proper alignment and styling.
- [ ] **Functional:** Clicking the Theme toggle successfully changes the theme.
- [ ] **Functional:** Clicking the Font Size toggle successfully changes the font size.
- [ ] **Persistence:** Theme and Font Size selections remain selected after refreshing the page.
