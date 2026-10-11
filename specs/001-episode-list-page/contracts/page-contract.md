# UI Contract: Episode List Page

**Feature**: 001-episode-list-page | **Date**: 2026-10-11

This contract defines the observable behavior of the episode list page — what the
visitor sees and can do — independent of implementation. Each clause maps to
spec requirements and is verified by the scenarios in
[quickstart.md](./quickstart.md).

## Page: Episode List (`/episodes` or site home)

### Rendered states

| State | Trigger | Expected UI |
|-------|---------|-------------|
| Populated | Catalog has ≥ 1 episode | All episodes listed, newest first, each showing title, publication date, duration, description, and a play control |
| Empty | Catalog has 0 episodes | Friendly "no episodes yet" message; no broken controls rendered |
| Search no-results | Active filter matches nothing | "No results" message; clearing the filter restores the full list |
| Audio error | Playback of an episode fails | Visible error message associated with the player; list remains fully interactive |

### Per-episode card (populated state)

- Title, formatted publication date, human-readable duration, description text.
- Play control (button): activating it starts that episode.
- When this episode is the active one, the card shows a clear "now playing" /
  "paused" indicator (FR-004).
- Long titles/descriptions truncate without breaking layout.
- Artwork (if present) renders with descriptive `alt` text; card remains correct
  without artwork.

### Player behavior (FR-003, FR-004, FR-005)

- Exactly one episode plays at a time; starting another stops the previous.
- Pause stops audio and the control offers resume; resume continues the same
  episode.
- Controls are `<button>`s, keyboard-operable, with accessible names
  ("Play <title>", "Pause <title>") and visible focus indication.

### Search (FR-008)

- Input filters the visible list by case-insensitive match on title or description.
- Full list restores when the input is cleared.
- Results update without page reload; well under 1s at 100 episodes.

### Global page guarantees (FR-009)

- Usable at mobile (≥ 320px wide) and desktop viewports; no horizontal overflow;
  no clipped controls.
- Full keyboard path: reach search, every card's play control, and player controls
  via Tab; activate via Enter/Space.
- Semantic structure: list markup for episodes, labeled controls, sufficient color
  contrast.
- No third-party network requests at runtime beyond the site's own files.

## Non-goals (this contract)

- Episode detail pages, downloads, subscriptions/RSS, comments, accounts — out of
  scope per spec Assumptions.
