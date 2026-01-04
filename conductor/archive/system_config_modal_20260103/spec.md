# Specification: System Config as Centered Modal

## 1. Overview
Redesign the `CustomizationMenu` (System Config) to operate as a centered modal instead of a right-hand sidebar. This change ensures visual consistency with other system dialogs like the `AuthModal` and improves focus on the configuration tasks.

## 2. Functional Requirements

### 2.1 Modal Transition
- **Trigger:** Clicking the terminal logo in the header still triggers the menu.
- **Positioning:** The menu will be centered vertically and horizontally on the screen.
- **Overlay:** A backdrop blur and darkened background overlay (consistent with `AuthModal`) must be applied behind the modal.

### 2.2 UI Consistency
- **Styling:** Adhere to the `AuthModal` aesthetic:
    - Rectangular bordered container.
    - Subtle glow effect on borders.
    - Same close button (X) positioning and style.
    - High-opacity monospaced typography for better readability.

### 2.3 Feature Parity
- **Contents:** All existing functionality must be preserved:
    - User Profile / Auth Status.
    - Theme Selector (Amber, Green, Blue).
    - Text Scaling (Small, Standard, Large).
    - Data Management (Export, Factory Reset).

## 3. Acceptance Criteria
- [ ] Clicking the logo opens the System Config as a centered modal.
- [ ] The menu styling matches the `AuthModal` component.
- [ ] All configuration options (themes, scaling, export, reset) function as before.
- [ ] The backdrop is blurred and darkened when the modal is open.

## 4. Out of Scope
- Adding new configuration options.
- Redesigning the internal layouts of the settings sections beyond necessary spacing adjustments.
