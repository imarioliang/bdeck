# Product Guidelines: Bdeck

## Tone and Voice
- **Command-Line Inspired:** User-facing copy should be terse, direct, and utilitarian. Avoid marketing fluff or overly friendly conversational filler.
- **Clarity Over Personality:** Instructions and feedback should focus on technical precision and speed of comprehension.

## Visual Identity
- **Retro-Terminal Command Center:** The interface features a deep dark aesthetic (#0a0a0a) with high-contrast amber (#ffb000) and green (#4ade80) terminal-inspired accents.
- **High-Density Modular Grid:** Layout follows a modular structure where subsystems (Command Center, Links, Timers, Objectives) are encapsulated in distinct bordered containers with pulse indicators and status badges.
- **Aesthetic Details:** Employs subtle scanlines, monospaced typography scaled for high information density, and glowing UI elements to emulate a legacy CRT terminal.

## Styling and Layout
- **Tailwind CSS:** All styling will be implemented using Tailwind CSS utility classes to maintain a consistent, raw aesthetic and facilitate rapid layout adjustments.
- **Monospaced Accents:** While general text might be sans-serif, monospaced fonts should be used for data, keyboard shortcuts, and code-like elements to reinforce the developer-centric feel.

## Accessibility and Navigation
- **Keyboard-First Design:** Full keyboard support is the primary requirement. Every action (opening links, starting timers, adding notes) must be accessible via keyboard shortcuts.
- **Visual Focus Indicators:** Clear and prominent focus states are essential for keyboard navigation within the multi-pane layout.
