# Rental Trace Case 001 — pseudonymized retrospective audit

This directory contains a user-authorized, de-identified **summary** of a real rental-search workflow. It is not a complete native tool trace or a replayable benchmark.

## Files
- [case_summary.json](case_summary.json): counts, known status and evaluation limits.
- [events-summary.json](events-summary.json): 34 redacted event summaries, including tool names, provenance class, partial status and unknown call times.
- [retrospective-score.md](retrospective-score.md): preliminary retrospective diagnostic score and limitations.
- [retrospective-score.json](retrospective-score.json): machine-readable scorecard.
- The previous binary data shards are explicit placeholder text. **Do not decode them as data.** Full email bodies and original tool payloads were not published.

## Provenance and privacy
- 22 legacy records were manually transcribed; no native connector transport hook was installed.
- Invocation timestamps and original chronological order are unknown. Sequence numbers reflect export/curation order, not authenticated execution order.
- 16 selected email excerpts existed in the private audit; the public summary intentionally omits message bodies and exact request arguments.
- Names, property names, locations, emails, phone numbers, addresses, message IDs and links are not published in the event summary.
- Pseudonymization reduces direct identification but cannot guarantee anonymity. The repository owner and surrounding project context remain visible.
- Three identified sends passed a limited SENT/message/recipient/thread metadata check. This does not prove delivery, reading, or overall task success.
- Full mailbox processing and per-call token/cost accounting remain unknown.

## Score interpretation
The **50/100 workflow score** is a low-to-moderate-confidence retrospective assessment of the available evidence. It is not an official benchmark result, not preregistered, not independently reviewed, and must not be compared with public leaderboard scores. Trace completeness is scored separately at 1/5; benchmark readiness is 1/5.

## Benchmark use
Use this case to develop failure taxonomy and trace schemas, not as a leaderboard entry. The complete private archive remains private; only the minimal de-identified summary and score are public.
