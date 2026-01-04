# Initial Concept
a web app that display frequenly visited site, with features

# Product Guide: Bdeck

## Target Audience
- **Power Users & Developers:** Individuals who require a highly efficient, customizable, and keyboard-friendly start page to manage their workflow and access tools quickly.

## Key Features
- **Frequently Visited Sites:** A manually curated list of bookmarks and quick links, ensuring users have immediate access to their most important resources.
    - **Pinning:** Users can pin important links to the top of the grid for immediate access.
    - **View Toggles:** Switch between a high-density vertical 'List' view and a terminal-inspired 'Grid' layout.
    - **Integrated Subsystems:** Grouped header and link grid within a unified container.
    - **Dual Navigation & Filtering:** Navigate via a hierarchical 'Repositories' sidebar (Categories) and a dynamic 'Tags' subsystem. Supports simultaneous category and tag filtering.
    - **Visual Watermarks:** Automated favicon fetching with generic fallback, displayed as high-density watermarks.
    - **Dynamic Metadata:** Link list displays category shorthands (.EXT) and active tags (.TAGS) for rapid identification.
- **Productivity Suite:**
    - **Project Timers:** Relative session-based timers with integrated interval management.
    - **Rest Protocol:** Advanced Pomodoro-style integration with configurable work/rest durations and audible alerts every 5 seconds after limit exceeded.
    - **Todo List:** A Google Keep-inspired checklist with inline editing, subtask nesting via keyboard (Tab), and automatic sorting of completed items.
    - **Notes:** A scratchpad or sticky notes feature for capturing quick thoughts and snippets.
- **Keyboard-Driven Navigation:** An omnibar-style interface or robust keyboard shortcuts to navigate the dashboard and launch links without leaving the keyboard.
    - **Command Palette (KBAR):** Global action menu (Ctrl+K) for rapid navigation and system commands.
    - **Quick-Access Keys:** Dedicated shortcuts (p, n, t) for instant pane focusing and interaction.
    - **System Customization:** Personalized terminal themes (Amber, Green, Blue) and global text scaling (Small to Large).
    - **Retro Terminal Aesthetic:** A high-fidelity terminal interface featuring independent scrollable containers, a two-row system bar, a 'Directories' sidebar, and strict 1px border alignment.
- **Data Persistence & Sync:**
    - **Cloud Synchronization:** Seamlessly syncs Links, Todos, Timers, and Notes across devices via Supabase.
    - **Offline First:** Fully functional offline with automatic synchronization when online.
    - **User Authentication:** Secure Email/Password login to manage personal data.

## Design Philosophy
- **Information-Dense Dashboard:** The UI will prioritize information density, displaying critical data, links, and tools at a glance to maximize utility and minimize navigation steps.
