# Tasks: Episode List Page

**Input**: Design documents from `/specs/001-episode-list-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. research.md (D6) and quickstart.md mandate Vitest + React
Testing Library + Playwright as part of the delivery; test tasks are written per
story so each story is verified independently.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single Next.js project: `src/`, `tests/`, `public/` at repository root (per
plan.md Structure Decision).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for a static-export Next.js
App Router project

- [X] T001 Scaffold Next.js App Router project in repository root: `package.json`
     with Next.js + React 19 + TypeScript, `next.config.ts` with `output: 'export'`,
     `tsconfig.json`, and npm scripts `dev`, `build`, `test:unit`,
     `test:component`, `test:e2e` (paths: `package.json`, `next.config.ts`,
     `tsconfig.json`)
- [X] T002 [P] Create root layout and global stylesheet: semantic shell
     (`<main>` landmark, page title "mi-podcast") in `src/app/layout.tsx` and
     mobile-first base rules in `src/app/globals.css`
- [X] T003 [P] Configure test tooling: `vitest.config.ts` (unit + component via
     jsdom/React Testing Library) and `playwright.config.ts` (e2e runs against the
     static export output directory) at repository root

**Checkpoint**: `npm run dev` renders the shell; `npm run build` emits only static
files (constitution Principle I gate)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Episode data foundation ALL user stories depend on

**?? CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Seed the mock catalog in `src/content/episodes.json` with 6–10 episodes
     per the schema in `contracts/episode-schema.json`: required fields `id` (unique
     slug `^[a-z0-9]+(-[a-z0-9]+)*$`), `title` (1–200 chars), `description`
     (1–2000 chars), `publishedAt` (ISO `YYYY-MM-DD`), `durationSeconds` (integer
     > 0), `audioUrl` (site-relative, starts with `/audio/`); include variety
     (long/short titles, some episodes without `coverImageUrl`)
- [X] T005 [P] Add placeholder audio files under `public/audio/` matching every
     `audioUrl` in `src/content/episodes.json` (short silent or tone MP3s; missing
     files must fail the build guard)
- [X] T006 Implement the episode loader in `src/lib/episodes.ts`: typed
     `Episode` per `data-model.md`, load + validate `src/content/episodes.json`
     against `contracts/episode-schema.json` at build time, fail the build on
     invalid episode, duplicate `id`, absolute `audioUrl`, or `audioUrl` target
     missing from `public/audio/`; export `getEpisodes()` returning episodes
     sorted by `publishedAt` descending (newest first, FR-002)
- [X] T007 Create the static episodes page route `src/app/episodes/page.tsx`
     rendering a minimal server component that calls `getEpisodes()` (list body
     comes in US1); ensure it prerenders under `output: 'export'`

**Checkpoint**: Build fails on malformed catalog data; `getEpisodes()` returns a
validated, newest-first list — user story implementation can now begin

---

## Phase 3: User Story 1 - Browse the episode catalog (Priority: P1) ?? MVP

**Goal**: Visitor sees all episodes with title, date, duration, description, newest
first (FR-001, FR-002, FR-006, FR-010)

**Independent Test**: Open the page with the seeded catalog; every episode is listed
newest-first with its key details; empty catalog shows the friendly message

### Tests for User Story 1

- [X] T008 [P] [US1] Unit test for the loader in `tests/unit/episodes.test.ts`:
     sorting newest-first, schema validation failures (duplicate id, bad date,
     absolute audioUrl), empty catalog returns `[]`
- [X] T009 [P] [US1] Component test for `EpisodeCard` in
     `tests/component/episode-card.test.tsx`: renders title, formatted date,
     human-readable duration, description; truncates very long title/description
     without throwing; renders without `coverImageUrl`; renders artwork with
     descriptive `alt` when present

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement `src/components/EpisodeCard.tsx`: title, formatted
     publication date, human-readable duration (`durationSeconds` → e.g. "42
     min"), description, optional artwork with `alt`, truncation for long text,
     and a placeholder area for the play control (wired in US2)
- [X] T011 [US1] Implement `src/components/EpisodeList.tsx` and wire into
     `src/app/episodes/page.tsx`: `<ul>`/`<li>` semantic list of `EpisodeCard`s
     in `getEpisodes()` order; empty-catalog state renders a friendly "no
     episodes yet" message (FR-006) instead of the list
- [X] T012 [US1] Run `npm run test:unit` and `npm run test:component`; fix until
     green; verify `npm run build` still exports static files with the populated
     list (quickstart scenarios US1 + M1)

**Checkpoint**: User Story 1 fully functional and testable independently (MVP!)

---

## Phase 4: User Story 2 - Play an episode (Priority: P2)

**Goal**: Visitor plays/pauses episodes in-page; one episode at a time; active
episode clearly marked; audio errors surface without breaking the list (FR-003,
FR-004, FR-005, FR-007)

**Independent Test**: Activate play on a card; audio starts; indicator shows;
pause/resume works; starting another episode stops the previous; broken
`audioUrl` shows an error and the list stays interactive

### Tests for User Story 2

- [ ] T013 [P] [US2] Component test for the player in
     `tests/component/player.test.tsx`: play starts the episode, pause/resume
     toggles, starting episode B while A plays leaves only B active (FR-005),
     audio `error` event surfaces the error message state (FR-007)
- [ ] T014 [P] [US2] Component test for `EpisodeCard` play integration in
     `tests/component/episode-card-play.test.tsx`: play button accessible name
     "Play <title>" / "Pause <title>", `aria-pressed` reflects state, now-playing
     indicator visible for the active episode

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

### Implementation for User Story 2

- [ ] T015 [P] [US2] Implement `src/components/Player.tsx` (client component):
     single HTML5 audio source owning state `{ playingEpisodeId, isPlaying,
     errorMessage }`; play/pause/resume; starting a new episode stops the
     previous; `error` listener sets a visible message while the rest of the page
     remains interactive (research D3, D7)
- [ ] T016 [US2] Integrate play controls: add the play/pause `<button>` to
     `src/components/EpisodeCard.tsx` (accessible names per T014), render the
     now-playing/paused indicator on the active card, and mount `Player` from
     `src/app/layout.tsx` (or `src/app/episodes/page.tsx`) wired to the episode
     catalog
- [ ] T017 [US2] Run `npm run test:component` and Playwright flow in
     `tests/e2e/play.spec.ts` covering: play → audio starts, pause → stops,
     switch episodes → previous stops, broken audio → error message, list still
     interactive (quickstart M2); fix until green

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 - Search episodes by title (Priority: P3)

**Goal**: Visitor filters the list by title/description; clearing restores the
full list; "no results" message when nothing matches (FR-008); performs well at
100 episodes (SC-005)

**Independent Test**: Enter a term → only matching episodes remain; clear → full
list returns; unmatched term → "no results" message; 100-episode catalog filters
in under 1 second

### Tests for User Story 3

- [ ] T018 [P] [US3] Unit test for the filter in `tests/unit/search.test.ts`:
     case-insensitive substring match on `title` and `description`, empty query
     returns all episodes, no-match returns `[]`
- [ ] T019 [P] [US3] Component test for `SearchBar` in
     `tests/component/search-bar.test.tsx`: labeled input, typing filters,
     clearing restores, "no results" message appears for an unmatched term

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

### Implementation for User Story 3

- [ ] T020 [P] [US3] Implement the pure filter in `src/lib/search.ts`:
     `filterEpisodes(episodes, query)` — case-insensitive substring match on
     `title` or `description`; empty/whitespace query returns the full list
     (research D4)
- [ ] T021 [P] [US3] Implement `src/components/SearchBar.tsx` (client
     component): labeled controlled input calling `filterEpisodes`
- [ ] T022 [US3] Wire search into `src/app/episodes/page.tsx`: filtered list
     rendering; show the "no results" message when the active query matches
     nothing; clearing restores the full list without reload
- [ ] T023 [US3] Add a 100-episode scale fixture/test: generate a 100-episode
     array in `tests/unit/search.test.ts` (or a fixture under `tests/fixtures/`)
     asserting filter correctness; spot-check responsiveness in the browser
     (quickstart M5 / SC-005)
- [ ] T024 [US3] Run `npm run test:unit`, `npm run test:component`, and
     Playwright flow in `tests/e2e/search.spec.ts`; fix until green

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Constitution compliance and cross-story quality (Principles III, IV;
quickstart validation)

- [ ] T025 [P] Responsive pass: verify and fix layout at 320px / 768px / 1280px in
     `src/app/globals.css` and CSS Modules for `EpisodeCard`, `Player`,
     `SearchBar` — no horizontal overflow, no clipped controls (FR-009, quickstart
     M4)
- [ ] T026 [P] Accessibility pass across `src/components/` and
     `src/app/episodes/page.tsx`: semantic list markup, visible focus styles,
     keyboard path search → cards → player, `aria-pressed` on play/pause, contrast
     ≥ 4.5:1 body text; verify keyboard-only walkthrough (quickstart M3, SC-004)
- [ ] T027 Performance check against Static-First/Small-and-Fast: `npm run
     build` output contains only static files, no third-party runtime requests,
     page usable < 3s under throttled mobile profile (SC-002); trim any avoidable
     client JS
- [ ] T028 Full validation sweep: run `npm run test:unit`,
     `npm run test:component`, `npm run test:e2e`, and manual scenarios M1–M5 from
     `quickstart.md`; fix all defects (deviation: broken links, missing assets,
     console errors are blocking)
- [ ] T029 Record the required constitution follow-up: request
     `/speckit.constitution` amendment approving the Next.js toolchain (tracked in
     plan.md Complexity Tracking) before release — no code change; note in PR
     description

**Checkpoint**: Feature fully validated; ready for review/merge pending
constitution amendment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
  - T006 depends on T004 (catalog) and T005 (audio assets present for the
    missing-file guard)
- **User Stories (Phase 3–5)**: All depend on Foundational completion
  - Priority order: US1 (P1) → US2 (P2) → US3 (P3)
  - US3 depends on US1's `EpisodeList`/page wiring (T022 extends T011) but its
    filter logic (T020) is independent
  - US2 depends on US1's `EpisodeCard` (T016 extends T010)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational — no other-story dependencies
- **User Story 2 (P2)**: Starts after Foundational; integrates with US1's card but
  is independently testable via its own player tests
- **User Story 3 (P3)**: Starts after Foundational; filter logic independent, page
  wiring builds on US1

### Within Each User Story

- Tests written FIRST and verified to FAIL, then implementation
- Pure logic/lib before components; components before page wiring
- Story complete before moving to next priority

### Parallel Opportunities

- T002 + T003 (Setup) in parallel
- T005 in parallel with T004 (both Foundational, different files)
- T008 + T009 (US1 tests) in parallel
- T013 + T014 (US2 tests) in parallel
- T018 + T019 (US3 tests) in parallel; T020 + T021 (US3 impl) in parallel
- T025 + T026 (Polish) in parallel
- Different user stories can be worked in parallel after Foundational if capacity
  allows (US2/US3 touch some US1 files — coordinate to avoid same-file conflicts)

---

## Parallel Example: User Story 1

```bash
# Launch both US1 tests together (different files, no deps):
Task: "Unit test for the loader in tests/unit/episodes.test.ts"
Task: "Component test for EpisodeCard in tests/component/episode-card.test.tsx"

# Then launch independent implementation pieces:
Task: "Implement src/components/EpisodeCard.tsx"
# (EpisodeList depends on EpisodeCard, so it follows)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: seeded catalog browsable newest-first, empty state works
5. Static export is deployable at this point

### Incremental Delivery

1. Setup + Foundational → data foundation ready
2. Add US1 → test independently → deploy/demo (MVP!)
3. Add US2 → test independently → deploy/demo
4. Add US3 → test independently → deploy/demo
5. Polish → full quickstart sweep → review (pending constitution amendment)

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (card/list)
   - Developer B: US2 (player) — coordinate on `EpisodeCard` integration
   - Developer C: US3 (search lib/SearchBar) — page wiring after US1 lands
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All audio and data are in-repo mock content; no network dependencies beyond the
  site's own files (constitution Principles I–II)
