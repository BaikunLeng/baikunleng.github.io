# AgentWork

**Compare the work. Across different kinds of work.**

[Open the prototype](https://baikunleng.github.io/agentwork-bench/?v=4#arena) · [Product and research plan](docs/APEX_INSPIRED_MULTITASK_PLAN.md) · [V4 implementation notes](docs/V4_IMPLEMENTATION.md)

## Current implementation — v4.0.0

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
node --test agentwork-bench/tests/multitask.test.mjs
```

The initial v4 suite contains 40 passing tests, including wrong-output mutations. Browser inspection covered desktop and mobile layouts, navigation, comparison, downloads, voting, traces, world browsing and session drafts. The authoring environment blocks browser URL navigation, so visual checks used an in-memory page with the same CSS/JS. Persistent browser storage and live production navigation were not validated in that check.

## Structure

```text
agentwork-bench/
  index.html               # Generic application shell
  styles.css               # Existing visual system
  v4/
    catalog.mjs            # Domains, TaskSpec registry, parameter validation
    worlds.mjs             # Original public world fixtures
    runtime.mjs            # Local gateway, policies, artifacts, output verifier
    ui.mjs                 # Navigation, composer, artifact/trace viewers, storage
    multitask.css          # Multi-domain layouts
  tests/multitask.test.mjs
  docs/
    APEX_INSPIRED_MULTITASK_PLAN.md
    V4_IMPLEMENTATION.md
  legacy/                  # Previous five housing demos retained unchanged
```

The old `app.js` is retained for provenance but is not loaded by v4. Prior local histories are not deleted or relabeled as v4 runs.

## Next milestone

Add a real model adapter and server-owned execution gateway, then independently review the three implemented worlds. Implement research, office and travel as genuinely different environments before changing their state to runnable. Keep private grading data and keys out of this GitHub Pages directory.
