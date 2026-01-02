# Product Guidelines: Bdeck

## Tone and Voice
- **Command-Line Inspired:** User-facing copy should be terse, direct, and utilitarian. Avoid marketing fluff or overly friendly conversational filler.
- **Clarity Over Personality:** Instructions and feedback should focus on technical precision and speed of comprehension.

## Visual Identity
- **Brutalist Utility:** The interface will be raw and functional. Expect bold borders, clearly defined sections, and a complete absence of unnecessary decorative elements like gradients or soft shadows.
- **Terminal Multi-Pane Layout:** The UI will emulate a terminal multiplexer (e.g., tmux) using a multi-pane grid system. Each tool (Timer, Todo, Notes) will reside in its own clearly bordered "pane".

## Styling and Layout
- **Tailwind CSS:** All styling will be implemented using Tailwind CSS utility classes to maintain a consistent, raw aesthetic and facilitate rapid layout adjustments.
- **Monospaced Accents:** While general text might be sans-serif, monospaced fonts should be used for data, keyboard shortcuts, and code-like elements to reinforce the developer-centric feel.

## Accessibility and Navigation
- **Keyboard-First Design:** Full keyboard support is the primary requirement. Every action (opening links, starting timers, adding notes) must be accessible via keyboard shortcuts.
- **Visual Focus Indicators:** Clear and prominent focus states are essential for keyboard navigation within the multi-pane layout.
