# Research: Episode List Page

**Feature**: 001-episode-list-page | **Date**: 2026-10-11

All Technical Context unknowns were resolved from owner input and constitution
constraints. No `[NEEDS CLARIFICATION]` markers remain.

## D1: Static generation approach in Next.js

**Decision**: Use Next.js App Router with `output: 'export'` in `next.config`, plus
`export const dynamic = 'force-static'` semantics (default under export). All pages
are prerendered to HTML at build time.

**Rationale**: Satisfies constitution Principle I (Static-First) — build output is
plain files hostable anywhere; no server runtime, no API routes, no server actions.

**Alternatives considered**:
- Default Next.js server rendering — rejected: violates Static-First and No-Backend.
- `getStaticProps` Pages Router — deprecated path; App Router is current.

## D2: Mock episode data format and location

**Decision**: Single TypeScript-checked JSON file at `src/content/episodes.json`,
validated at build time against the episode schema (see contracts/episode-schema.json).
Audio files live in `public/audio/`. Loaded via a small `lib/episodes.ts` import —
no fetching, no API.

**Rationale**: Owner specified "data is embedded in the content for the mock
episodes"; JSON in-repo satisfies Principle II and makes the catalog reproducible
from a fresh checkout. Build-time validation catches malformed data before deploy.

**Alternatives considered**:
- Markdown files with front matter — rejected: overkill for structured mock data
  with audio links; JSON is directly typed and validated.
- Remote CMS/fetch at build time — rejected: introduces external dependency;
  violates "reproducible from a fresh checkout" without network guarantees.

## D3: Audio playback strategy

**Decision**: One global player component owning a single HTML5 `Audio` instance
(or one `<audio>` element) in client-side React. Starting a new episode stops the
previous one. Active episode state drives the "now playing" indicator. Native
controls supplemented/replaced by accessible custom buttons (play/pause with
`aria-pressed`, labeled).

**Rationale**: Enforces FR-004/FR-005 (single playback, pause/resume) with the
smallest state surface: one `playingEpisodeId` + one `isPlaying` flag.

**Alternatives considered**:
- Per-card `<audio>` elements — rejected: allows multiple simultaneous playback
  unless heavily coordinated; more DOM weight.
- Third-party player library — rejected: violates Small-and-Fast and YAGNI; native
  Audio API is sufficient.

## D4: Client-side search/filter

**Decision**: Search is a controlled client component filtering the already-loaded
episode array by case-insensitive substring match on title + description. No
debounce server work needed; for ≤100 episodes plain `Array.filter` is well under
the 1s requirement (SC-005). "No results" message when filter is empty.

**Rationale**: Episodes are already in the static page payload; filtering in memory
is the simplest approach that meets the performance goal.

**Alternatives considered**:
- Search index library (e.g., Lunr) — rejected: unnecessary for 100 small text
  records; adds payload and complexity.
- Build-time precomputed index — deferred: revisit only if catalog grows past
  SC-005 scale.

## D5: Responsive & accessibility implementation

**Decision**: Mobile-first CSS (CSS Modules + one global stylesheet); semantic
structure (`<main>`, `<ul>`/`<li>` for the list, real `<button>` controls); every
control keyboard-reachable with visible focus; `alt`/labels on meaningful images
(e.g., episode artwork); contrast checked against WCAG AA (4.5:1 body text).

**Rationale**: Constitution Principle IV is non-negotiable; these choices map
directly to FR-009 and the quickstart validation scenarios.

**Alternatives considered**:
- UI kit / Tailwind — rejected: heavier than needed for one page; owner stack
  favors lean output.

## D6: Testing approach

**Decision**:
- Vitest + React Testing Library: unit tests for `lib/episodes.ts` and filter
  logic; component tests for EpisodeCard states, Player single-playback rule,
  SearchBar empty/no-results states.
- Playwright e2e: three spec flows — browse (US1), play/pause/switch (US2), search
  (US3) — run against `next build && next start`-equivalent static preview
  (`npx serve out` or similar static preview of the export directory).
- Manual quickstart checks: empty catalog, broken audio URL, keyboard-only
  walkthrough, narrow viewport.

**Rationale**: Matches spec's acceptance scenarios and edge cases; e2e proves the
static export works end-to-end, not just in dev mode.

**Alternatives considered**:
- E2E only — rejected: slower feedback for filter/state logic.
- No automated tests — rejected: development workflow treats defects as blocking.

## D7: Empty and error states

**Decision**: Empty catalog → friendly message component (FR-006). Audio load
failure → `Audio` `error` event surfaces a visible message near the player while
the rest of the list stays interactive (FR-007). Both states have dedicated tests.

**Rationale**: Explicit spec requirements; handling them in the single global
player keeps error UX consistent across episodes.

## Open follow-ups (non-blocking)

- Constitution amendment to approve the Next.js toolchain (run
  `/speckit.constitution`) — required before release, tracked in plan.md
  Complexity Tracking.
