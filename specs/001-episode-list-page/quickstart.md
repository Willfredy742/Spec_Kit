# Quickstart: Episode List Page

**Feature**: 001-episode-list-page | **Date**: 2026-10-11

Validation guide for the feature end-to-end. Implementation details live in
[data-model.md](./data-model.md) and [contracts/](./contracts/); task breakdown
comes later in `tasks.md`.

## Prerequisites

- Node.js ≥ 20 and npm installed
- Repository checked out fresh (mock data and audio assets are in-repo)

## Setup & build

```bash
npm install
npm run dev        # local development at http://localhost:3000
npm run build      # static export (must produce only static files, e.g. out/)
```

Static-output gate (constitution Principle I): `npm run build` MUST succeed with no
server-only features and the export directory MUST be servable by any static file
server.

## Automated validation

```bash
npm run test:unit         # Vitest: data loading, ordering, search filter logic
npm run test:component    # React Testing Library: cards, player, search states
npm run test:e2e          # Playwright against the static export
```

E2E suites must cover the three user stories:
1. **Browse** — catalog listed, newest first, all fields visible (spec US1).
2. **Play** — play/pause/switch behavior, single active episode, indicator (spec US2).
3. **Search** — filter, clear, no-results message (spec US3).

## Manual scenarios (contract verification)

Run against the dev server or a static preview of the export. Each scenario maps to
[contracts/page-contract.md](./contracts/page-contract.md).

### M1: Empty catalog (edge case, FR-006)

1. Temporarily point the loader at an empty episode array.
2. **Expect**: friendly empty-state message; no play controls rendered; no console
   errors.

### M2: Broken audio (edge case, FR-007)

1. Point one episode's `audioUrl` at a missing file and play it.
2. **Expect**: visible error message; other episodes still playable; page otherwise
   intact.

### M3: Keyboard-only walkthrough (FR-009, SC-004)

1. Load the populated list; using only Tab/Shift+Tab and Enter/Space:
   reach the search box, filter, clear it, activate a card's play control, then
   pause/resume via the player.
2. **Expect**: every control reachable with visible focus; accessible names present;
   full browse-and-play flow completable without a mouse.

### M4: Responsive check (FR-009)

1. At 320px, 768px, and 1280px widths, view the populated list during playback.
2. **Expect**: no horizontal scroll, no clipped controls, readable text, artwork
   scales without breaking layout.

### M5: Search at scale (SC-005)

1. Seed 100 episodes; type a term present in one title; then a term matching none.
2. **Expected**: filtering feels instant (< 1s); "no results" message for the
   unmatched term; clearing restores all 100.

## Success criteria spot-checks

| Criterion | How to verify |
|-----------|---------------|
| SC-001 (< 30s to find & play) | Fresh visitor walkthrough on mobile viewport |
| SC-002 (< 3s to usable list) | Throttled mobile-network profile in browser devtools against static export |
| SC-003 (audio < 5s, 95%) | Play several episodes from the static export; note start latency |
| SC-004 (keyboard-only) | Scenario M3 |
| SC-005 (search < 1s @ 100) | Scenario M5 |

## Cleanup

Revert any temporary data mutations (empty catalog, broken `audioUrl`) before
committing; `npm run build` and the automated suites MUST pass on the final state.
