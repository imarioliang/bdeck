# Track Specification: Buff Up Links & Tag Functions

## 1. Overview
Enhance the Links system by introducing a tagging subsystem, repurposing the `EXT` and `SIZE` columns for dynamic metadata, and implementing glitchy hover animations for a more reactive terminal experience.

## 2. Functional & Visual Requirements
- **Tag Subsystem:**
  - Add a `tags` array to the `Link` data model.
  - Implement a comma-separated text input in the "Modify Module" modal to manage tags.
- **Dynamic Columns (Retro Only):**
  - **EXT Column:** Display an automatic 3-letter shorthand derived from the category (e.g., `DEVELOPMENT` -> `.DEV`).
  - **SIZE Column:** Display the link's tags. Show the first 1-2 tags horizontally, followed by `...` if more exist.
- **Visual Scaling:**
  - Increase the font size for the entire link row (FILENAME, EXT, SIZE, STATUS) in Retro mode for uniform readability.
- **Interactive Animations:**
  - **Scale & Shake:** Implement a hover animation for sidebar categories and links list items. The effect should include a slight scaling and a minimal "glitchy jitter" to simulate an unstable CRT terminal.
- **Data Model Update:**
  - Update storage logic to handle the new `tags` property with backward compatibility.

## 3. Non-Functional Requirements
- **Consistency:** The glitch animation must feel intentional and not disrupt the user's ability to click targets.
- **Modern Skin Integrity:** Visual and structural column shifts remain strictly scoped to `data-skin='retro'`.

## 4. Acceptance Criteria
- [ ] Links correctly store and display multiple tags.
- [ ] The `EXT` and `SIZE` columns reflect dynamic category/tag data.
- [ ] Hovering over sidebar items or link rows triggers a slight scale and jitter animation.
- [ ] All link text is larger and clearer in Retro mode.

## 5. Out of Scope
- Global tag searching or dedicated tag management.
