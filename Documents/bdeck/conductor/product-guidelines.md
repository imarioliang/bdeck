# Product Guidelines: Bdeck

## Tone and Voice
- **Command-Line Inspired:** User-facing copy should be terse, direct, and utilitarian. Avoid marketing fluff or overly friendly conversational filler.
- **Clarity Over Personality:** Instructions and feedback should focus on technical precision and speed of comprehension.

## Visual Identity
- **Retro-Terminal Command Center:** The interface features a deep dark aesthetic (#0a0a0a) with high-contrast amber (#ffb000) and green (#4ade80) terminal-inspired accents.
- **Pixel-Perfect Terminal Hierarchy:** Enforces strict layout constraints (min/max heights), uniform 24px gutters, and precise 1px border snap alignment. Employs independent scrollable panes with sticky headers and high-contrast 'double-inversion' logic for nested interactive elements.
- **Aesthetic Details:** Employs subtle scanlines, monospaced typography scaled for high information density, and glowing UI elements to emulate a legacy CRT terminal.

## Styling and Layout
- **Tailwind CSS:** All styling will be implemented using Tailwind CSS utility classes to maintain a consistent, raw aesthetic and facilitate rapid layout adjustments.
- **Layered Monospace Hierarchy:** Use a multi-font hierarchy for terminal skins. Primary 8-bit aesthetic (Press Start 2P) for headers and link titles, and highly readable monospace (VT323) for data inputs and small metadata to maintain information density.

## Accessibility and Navigation
- **Keyboard-First Design:** Full keyboard support is the primary requirement. Every action (opening links, starting timers, adding notes) must be accessible via keyboard shortcuts.
- **Visual Focus Indicators:** Clear and prominent focus states are essential for keyboard navigation within the multi-pane layout.
