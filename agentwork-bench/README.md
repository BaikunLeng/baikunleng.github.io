# AgentWork

**Compare the work. Across different kinds of work.**

[Open the prototype](https://baikunleng.github.io/agentwork-bench/?v=5#arena) · [Product and research plan](docs/APEX_INSPIRED_MULTITASK_PLAN.md) · [V4 implementation notes](docs/V4_IMPLEMENTATION.md)

[Design Arena reference audit and v5 changes](docs/DESIGN_ARENA_REFERENCE_AUDIT.md)

## Current interface — v5.0.0 / task engine — v4.0.0

The site is a multi-domain front-end prototype, not a rental-search product and not a real-model leaderboard.

| Domain | Task | State |
| --- | --- | --- |
| Procurement | Compare current supplier quotes and first-year costs | Runnable synthetic demo |
| Data & reports | Reconcile revisions, refunds and currencies | Runnable synthetic demo |
| Personal services | Verify rent, parking and lease availability | Runnable synthetic demo |
| Research | Reconcile conflicting evidence and revise a memo | Task design only |
| Office coordination | Coordinate a meeting across time zones | Task design only |
| Travel & events | Replan an offsite after cancellation | Task design only |

There are **six task entries, three executable public worlds and two scripted reference policies**. A domain entry is not a completed benchmark. The 18-pilot / 120-task plan remains a roadmap.

### v5 product changes

The detailed Design Arena audit distinguishes its four-model generic tournament from its two-agent artifact comparison. This preview uses the latter interaction principle: category entry, full submitted artifacts, synchronized Table/Report tabs, expandable preview/source views, voting before check reveal and separate ranking tracks. It does not copy branding, pretend to provide four real models or fabricate global rankings.

### What works

- Generic task composer, domain filters, searchable task library and world browser.
- TaskSpec-driven parameters: procurement uses budget and deadline; data uses the reporting period; housing alone uses floor area and lease date.
- Independent world clones for A/B comparisons; deterministic calls recorded during actual local execution.
- Procurement reads current quotes and waits on a simulated supplier reply; data reconciles actual fixture rows rather than reusing housing logic.
- Generated CSV and Markdown artifacts, tabular previews, source inspection and downloads.
- Output-based checks for costs, dates, refunds, FX, revisions, consistency and unauthorized state changes.
- Local task drafts, run records and separate preference votes. Storage failure is surfaced; export works without persistence.
- A reference suite computes results across three worlds. The real-model leaderboard remains empty.

### What does not work yet

No live LLM adapter, server-side runner, hidden test set, real email, external account access, model billing or global voting. Free text is saved as a task idea; it is **not interpreted by a model**. CSV output is not an XLSX workbook. Public demo checks are not independently reviewed benchmark grades.

All example organizations and data are fictional. No private Gmail, personal financial material or restricted APEX task files are included. The model-use fields are null when unavailable, not estimated.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000 --directory agentwork-bench
```

Open `http://localhost:8000/`. Serve via HTTP so ES modules load correctly.

## Test

Requires Node.js with the built-in test runner and standard ES-module support; no npm dependencies:

```sh
node --test agentwork-bench/tests/*.test.mjs
```

The combined suite passes 51 tests (40 runtime tests and 11 presentation tests). The v5 browser check passed 36 assertions including category selection, artifact switching, downloads, vote reveal and domain filters. Browser URL navigation is blocked in the authoring environment: checks used in-memory CSS/Blob modules and a storage shim. Public navigation, real storage persistence and clipboard permissions are not claimed as end-to-end tested.

## Structure

```text
agentwork-bench/
  index.html               # v5 entry point
  v5/
    ui.mjs                 # Product UI, category launcher, artifact-first comparison
    product.css            # Original responsive design
    presentation.mjs       # Safe viewers, filtering, anonymous export
  styles.css               # Existing visual system
  v4/
    catalog.mjs            # Domains, TaskSpec registry, parameter validation
    worlds.mjs             # Original public world fixtures
    runtime.mjs            # Local gateway, policies, artifacts, output verifier
    ui.mjs                 # Navigation, composer, artifact/trace viewers, storage
    multitask.css          # Multi-domain layouts
  tests/
    multitask.test.mjs
    presentation.test.mjs
  docs/
    APEX_INSPIRED_MULTITASK_PLAN.md
    V4_IMPLEMENTATION.md
    DESIGN_ARENA_REFERENCE_AUDIT.md
  legacy/                  # Previous five housing demos retained unchanged
```

The old `app.js` and v4 UI files are retained for provenance, but the active entry point loads v5. The underlying TaskSpec, synthetic worlds and runner still use v4; historical valid local records are retained. Prior local histories are not deleted or relabeled as v4 runs.

## Next milestone

Add a real model adapter and server-owned execution gateway, then independently review the three implemented worlds. Implement research, office and travel as genuinely different environments before changing their state to runnable. Keep private grading data and keys out of this GitHub Pages directory.
