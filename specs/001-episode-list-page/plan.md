# Implementation Plan: Episode List Page

**Branch**: `001-episode-list-page` | **Date**: 2026-10-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-episode-list-page/spec.md`

## Summary

Build a responsive, statically generated episode list page for the mi-podcast site
using Next.js in static-export mode. Episode data is mock content embedded in the
repository; visitors browse episodes (newest first), play/pause them in-page with a
single active player, and can search by title/description. No database, no server
runtime, no accounts.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js default toolchain)

**Primary Dependencies**: Next.js (App Router) in `output: 'export'` static mode;
React 19; no UI/component libraries, no CSS frameworks beyond plain CSS/CSS Modules

**Storage**: No database. Mock episodes embedded as static content in the repository
(see data model); audio files served as static assets

**Testing**: Vitest + React Testing Library (component/unit); Playwright
(end-to-end browse/play/search flows); manual responsive/a11y checks via quickstart

**Target Platform**: Static hosting (any static file host); modern evergreen browsers;
mobile + desktop viewports

**Project Type**: Web (fully static site)

**Performance Goals**: Page usable < 3s on typical mobile connection (SC-002); play
control → audio < 5s for 95% of attempts (SC-003); search results < 1s at 100
episodes (SC-005)

**Constraints**: Static export only — no API routes, no server actions, no
middleware, no ISR/SSR at request time; responsive at all widths; baseline
accessibility (semantic HTML, keyboard, labels, contrast); single audio playing at a
time

**Scale/Scope**: 1 page (episode list) + shared layout/player; ~20–50 mock episodes
initially, must scale to 100 episodes per SC-005

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution: [.specify/memory/constitution.md](../../.specify/memory/constitution.md) v1.0.0

| # | Principle / Constraint | Status | Notes |
|---|------------------------|--------|-------|
| I | Static-First (NON-NEGOTIABLE) | ✅ PASS | `output: 'export'` produces only static files; no server runtime at view time |
| II | No Backend by Default | ✅ PASS | Mock episodes embedded in repo content; no auth, no server state |
| III | Small and Fast | ⚠️ PASS w/ conditions | Framework JS bundle is a deviation from "prefer plain"; mitigated: no UI libs, CSS Modules only, static HTML shell, code-split audio logic |
| IV | Accessible and Responsive | ✅ PASS | Enforced via FR-009; verified in quickstart scenarios |
| V | Simplicity (YAGNI) | ⚠️ PASS w/ conditions | Build tooling (Next.js) added by explicit owner decision; no further tooling beyond test essentials |
| — | Tech Constraints: vanilla-only tool | ❌ DEVIATION (justified) | Constitution requires tool approval by amendment; owner explicitly selected Next.js static configuration. **Follow-up: run `/speckit.constitution` to amend and approve Next.js as the approved toolchain (MINOR bump)** |

**Gate result**: PASS for planning. The vanilla-only constraint deviation is justified
by explicit owner direction and recorded in Complexity Tracking; a constitution
amendment is required before merge/release per Governance.

## Project Structure

### Documentation (this feature)

```text
specs/001-episode-list-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── episode-schema.json
│   └── page-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx           # Root layout, global styles, page shell
│   ├── page.tsx             # Home → redirects/links to episodes list
│   └── episodes/
│       └── page.tsx         # Episode list page (static)
├── components/
│   ├── EpisodeList.tsx      # Rendered list of EpisodeCard
│   ├── EpisodeCard.tsx      # Title/date/duration/description + play control
│   ├── Player.tsx           # Single global audio player (play/pause/active state)
│   └── SearchBar.tsx        # Client-side title/description filter input
├── lib/
│   └── episodes.ts          # Loads episode data from embedded content
├── content/
│   └── episodes.json        # Mock episode catalog (data lives in repo)
└── public/
    └── audio/               # Static audio files for mock episodes

tests/
├── unit/                    # Vitest: episodes lib, search filter logic
├── component/               # React Testing Library: cards, player, search
└── e2e/                     # Playwright: browse, play, search, empty/error states
```

**Structure Decision**: Single static Next.js project (App Router, static export).
Episode catalog in `src/content/episodes.json` satisfies "data embedded in content";
the page is fully static with client components only where interaction requires them
(player, search). No backend/frontend split — everything ships as static files.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Next.js toolchain (vanilla-only constraint) | Owner explicitly selected Next.js with static site configuration | Hand-rolled vanilla setup rejected by owner direction; Next.js static export still satisfies Static-First and No-Backend principles |
| Framework JS payload (Small-and-Fast preference) | Required to run React components for player/search interactivity | Pure vanilla player/search deemed less maintainable for the owner's chosen stack; mitigated with zero extra UI libraries and static HTML shell |

**Required follow-up**: amend constitution (approve Next.js toolchain) via
`/speckit.constitution` before this feature is released.
