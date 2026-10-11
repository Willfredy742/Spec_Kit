# Data Model: Episode List Page

**Feature**: 001-episode-list-page | **Date**: 2026-10-11

## Entities

### Episode

A single podcast episode as embedded mock content in the repository. Read-only on
the site; there is no user-generated data.

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| `id` | string | yes | Unique, stable identifier (slug-style: lowercase, hyphens). Used as React key and playback identity. |
| `title` | string | yes | Non-empty, ≤ 200 chars. Truncation in UI handled gracefully (edge case). |
| `description` | string | yes | Non-empty, ≤ 2000 chars. Short summary shown on the card; also searchable. |
| `publishedAt` | string (ISO date) | yes | ISO `YYYY-MM-DD`. Drives newest-first ordering (FR-002, Assumptions). |
| `durationSeconds` | integer | yes | > 0. Displayed human-readable (e.g., `42 min`). |
| `audioUrl` | string | yes | Relative path to a file under `public/audio/` (e.g., `/audio/ep-001.mp3`). Relative paths required by constitution (works from any sub-path). |
| `coverImageUrl` | string | no | Relative path to artwork under `public/`. If omitted, no image slot rendered; `alt` required when present. |

### Relationships

- The catalog (`Episode[]`) is a flat collection; no nested entities.
- An `Episode` is referenced by the global `Player` as `playingEpisodeId` (UI state,
  not persisted).

### State transitions (player)

```text
[stopped] --play(episode E)--> [playing E]
[playing E] --pause--> [paused E]
[paused E] --resume--> [playing E]
[playing E] --play(other F)--> [playing F]   (E stops implicitly)
[playing/paused E] --audio error--> [error, message shown, list still usable]
```

Only one episode can occupy playing/paused state at a time (FR-005).

### Derived data

- **Default ordering**: episodes sorted by `publishedAt` descending (newest first).
  Computed once when loading the catalog; not stored.
- **Search matches**: case-insensitive substring of `title` or `description`
  (FR-008). Computed per keystroke client-side.

## Validation rules (build time)

Loading `src/content/episodes.json` MUST fail the build if:

1. Any episode fails the schema in [contracts/episode-schema.json](./contracts/episode-schema.json).
2. Duplicate `id` values exist.
3. `audioUrl` is absolute (must be site-relative).
4. Any `audioUrl` target file is missing from `public/audio/` (broken-asset guard).

## Mock data volume

- Initial seed: 6–10 episodes with representative variety (long/short titles,
  missing `coverImageUrl`, varied dates).
- Must remain correct at 100 episodes (SC-005).
