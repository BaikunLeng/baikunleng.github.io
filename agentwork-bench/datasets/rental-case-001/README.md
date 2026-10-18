# Rental Trace Case 001 — pseudonymized retrospective audit

This directory contains a user-authorized, de-identified **summary** of a real rental-search workflow. It is not a complete native tool trace, not a replayable benchmark, and not a model score.

## Files
- [case_summary.json](case_summary.json): counts, known status and evaluation limits.
- [events-summary.json](events-summary.json): 34 redacted event summaries, including tool names, provenance class, partial status and unknown call times.
- The previous binary data shards were incomplete and have been replaced with explicit placeholder text. **Do not decode them as data.** The full email bodies and original tool payloads were not published in this upload.

## Provenance and privacy
- 22 legacy records were manually transcribed; no native connector transport hook was installed.
- Invocation timestamps and original chronological order are unknown. Sequence numbers reflect export order, not authenticated execution order.
- 16 selected email excerpts existed in the private audit; the public summary intentionally omits message bodies and exact request arguments.
- Names, properties, locations, emails, phone numbers, addresses, IDs and links are not published in this summary. Prices are not included in the event summary.
- Pseudonymization reduces direct identification but cannot guarantee anonymity. The repository owner and surrounding project context remain visible.
- Three identified sends passed a limited SENT/message/recipient/thread metadata check. That does not prove delivery, reading, or overall task success.
- Full mailbox processing, full token/cost accounting, a replayable world, an independently reviewed rubric and an overall Agent score remain unknown or unavailable.

## Benchmark use
Use this as a seed for failure taxonomy and trace schema design, not as a leaderboard entry. The complete private archive remains private; only the minimal de-identified summary is public.