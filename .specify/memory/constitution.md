<!--
Sync Impact Report
- Version change: (unversioned scaffold) → 1.0.0
- Modified principles: none (initial adoption; all placeholders replaced)
- Added sections:
  - Core Principles (I–V)
  - Technical Constraints
  - Development Workflow
  - Governance
- Removed sections: none
- Follow-up TODOs: none
-->

# mi-podcast Constitution

## Core Principles

### I. Static-First (NON-NEGOTIABLE)

Every page MUST ship as static files (HTML/CSS/JS/assets). No server-side runtime,
database, or build-time API calls are required to view the site. If a feature seems to
need a backend, it MUST be re-scoped or explicitly deferred as a new amendment.

Rationale: static output is trivially hostable, cacheable, and cannot fail at request
time.

### II. No Backend by Default

The application MUST NOT introduce server code, authentication, or persistent server-side
state. All data the site needs MUST live in the repository (JSON/YAML files, front matter,
or bundled assets) and be consumed client-side.

Rationale: keeps deployment to "upload files" and removes an entire class of operations
work.

### III. Small and Fast

Pages MUST load without blocking on third-party resources, and total initial payload
MUST stay lean (prefer plain HTML/CSS over heavy frameworks and vendor bundles).
Assets MUST be compressed and referenced with relative paths so the site works from any
sub-path.

Rationale: a static site's main advantage is speed; large payloads squander it.

### IV. Accessible and Responsive Baseline

Every page MUST be usable on mobile and desktop viewports and meet baseline
accessibility: semantic HTML, keyboard navigability, alt text on meaningful images, and
sufficient color contrast. Layout MUST NOT break at narrow widths.

Rationale: non-negotiable for public-facing content and often a legal requirement.

### V. Simplicity (YAGNI)

Start with the simplest implementation that satisfies the requirement. Dependencies MUST
be justified by a concrete need; no build tooling is added unless it removes demonstrable
pain. Prefer plain platform features over abstractions.

Rationale: every layer of tooling is maintenance surface an empty repo cannot afford.

## Technical Constraints

- Language/runtime: plain HTML, CSS, and vanilla JavaScript only, unless a future
  amendment approves a specific tool.
- No database, no server functions, no secrets committed to the repository.
- Content and data files MUST live in the repository so the site is fully reproducible
  from a fresh checkout.
- Third-party scripts (analytics, embeds) MUST be avoided; if required, they MUST load
  asynchronously and be listed in this constitution's amendments.

## Development Workflow

- Preview the site locally before considering any change done.
- Changes MUST be reviewed for compliance with the Core Principles before merge.
- Broken links, missing assets, and console errors are defects and MUST be fixed before
  release.
- Releases are simply publishing the static output; there is no separate deployment
  approval step.

## Governance

- This constitution supersedes ad-hoc decisions when conflicts arise.
- Amendments MUST be made through the Spec Kit constitution workflow, documented in the
  Sync Impact Report, and versioned per semantic versioning below.
- Versioning policy: MAJOR for removed or redefined principles, MINOR for added or
  materially expanded principles/sections, PATCH for clarifications and wording fixes.
- Every PR/review MUST verify compliance with the Core Principles; unjustified
  complexity MUST be rejected at review.
- Runtime development guidance belongs in project docs referenced by tasks/specs, not in
  this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-11 | **Last Amended**: 2026-10-11
