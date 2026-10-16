# V4 implementation report

Status: **implemented local prototype**, not a held-out benchmark or public AI leaderboard.

## Product change

The homepage is now domain-neutral. Six task types share a composer, library, world browser, run viewer and artifact inspector. Three types are runnable; three remain explicit task designs. Free text is saved as a draft rather than silently ignored by a simulated model.

Task-specific fields are declared in `v4/catalog.mjs`, not hard-coded into the main form. Existing warm typography and sidebar styling are retained. The original five rental mechanism demos are preserved under `legacy/` and in Git history.

## Distinct execution paths

1. **Procurement:** reads project rules, catalog and current quotes; discovers an expired supplier offer; sends one synthetic inquiry; waits 12 + 12 virtual hours; receives current terms; computes annual service, audit, setup and training costs. Produces a comparison CSV and a recommendation Markdown file. Default result: Birch at USD 21,000; Cedar costs USD 18,900 but misses the default delivery deadline. Changing that deadline can change the recommendation.
2. **Data:** reads transaction versions, accounting rules and a fixed fixture FX rate; keeps the latest revision per ID, removes cancelled rows, retains signed refunds, converts cents and filters the selected month. Produces a reconciled CSV and Markdown report. February net revenue: USD 1,550; March: USD 660.
3. **Personal services:** obtains synthetic quotes, verifies garage availability, dates and area, and separates recurring rent/parking from other fees. No real property or personal account data is used.

These run different algorithms over different data. They do not just rename housing cards.

## Verification and trace

The output verifier is a separate function, recomputing conditions from the public world fixture and checking emitted files. It checks preview/download consistency, totals, source references and unauthorized order/application state. Mutation tests cover wrong costs, damaged CSV, inconsistent memo, wrong revisions, missing FX, altered output and a spoofed `passed` field.

Tool events are captured when the local gateway executes, not hand-written animations. Raw events include sequence, virtual hour, tool input, output and provenance. No hidden chain-of-thought is recorded. No remote API cost or model usage is invented.

The fixture truth is public and shares the client trust boundary. A malicious client can edit it; these scores **must not** be used as authoritative public benchmark submissions. Future server-side evaluation requires isolation, authenticated runs, immutable assets and independent validation.

## Test record

- 40 Node tests passed with Node v22.16.0.
- Browser rendering used Chromium through Playwright `set_content` with identical source modules assembled into a test page. Normal URL navigation is blocked by the authoring environment; this was not a production browser check.
- Desktop 1440×1100 and mobile 390×844: no page-level horizontal overflow.
- Checked: six catalogue cards; procurement comparison; actual CSV download; vote/reveal; data outputs; trace events; three worlds; reference suite; session draft save/export; planned-task gating; search; mobile navigation.
- Persistent localStorage was unavailable in the opaque in-memory test origin. The app surfaced the expected export warning. Persistent reload and public deployment navigation remain separate checks, not claimed passed.

## Scope exclusions

No APEX data import; no reuse of restricted benchmark tasks; no private correspondence publication. No live models, genuine external mail, global preference aggregation, production backend or hidden evaluation. The six domains are not six independently reviewed benchmarks. The initial output formats are CSV and Markdown, not spreadsheets with formulas or rendered presentation files.
