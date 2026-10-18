# Retrospective score — Rental Workflow Case 001

**Version:** 0.1.0  
**Status:** Provisional, retrospective, evidence-limited. **Not an official benchmark result.**  
**Privacy:** Public version is de-identified; no email bodies, addresses, contact details, message IDs, or exact unit-level quotes are included.

## Result

- **Observed workflow score: 50/100**
- **Trace completeness: 1/5**
- **Benchmark readiness: 1/5**
- **Confidence: low to moderate**

The 50/100 is the equal-weight mean of six dimensions rated 1–5, multiplied by 20. It is a diagnostic assessment of this incomplete case, not a model leaderboard score and not comparable with APEX-Agents, SWE-bench, or other benchmarks.

## Dimensions

| Dimension | Score (1–5) | Summary |
|---|---:|---|
| Requirement and constraint handling | 3 | Core constraints were retained, but the user had to clarify important costs and unit-specific details. |
| Factual grounding and price attribution | 2 | Advertised prices, unit-specific quotes, parking, and mandatory fees were not consistently separated. The known arithmetic example was correct; the recorded issue concerns attribution/communication unless stronger evidence shows otherwise. |
| Tool use and execution | 3 | Search/read/send tools were used and three identified sends were later checked against sent-state metadata; searches were noisy and attachment extraction was incomplete. |
| Action-state consistency | 2 | Two successful sends remained marked as prepared in the earlier working manifest and were corrected only in a derived record. |
| Recovery and user effort | 2 | Several errors were corrected after user intervention rather than being proactively caught. |
| End-to-end task outcome | 3 | Useful replies and follow-ups were obtained, but the available evidence does not establish that every rental thread was processed or that a final fully verified shortlist was delivered. |

**Calculation:** (3 + 2 + 3 + 2 + 2 + 3) / 30 × 100 = **50/100**.

## Trace and benchmark readiness (separate from workflow score)

| Check | Result |
|---|---|
| Complete native tool capture | FAIL — 22 legacy events were manually transcribed; no raw transport events were captured |
| Authenticated original chronology | FAIL — original invocation times are unknown |
| Request/response pairing for every action | PARTIAL |
| Three identified sent messages' SENT metadata | PASS for those three only; does not prove delivery or reading |
| All rental mail processed | UNKNOWN |
| Per-call token/cost accounting | UNKNOWN / null |
| Replayable world and independent oracle | FAIL |
| Independent rubric review | Not done |

Do not fold trace completeness into the 50/100 workflow score. These measure different things.

## Failure taxonomy

- `PRICE_ATTRIBUTION`: mixing advertised price, unit-specific quote, parking, mandatory fees, or concessions.
- `STATE_SYNC`: external action succeeded but local action status stayed stale.
- `TRACE_COVERAGE`: missing raw request/response data, invocation times, and authenticated chronology.
- `SEARCH_PRECISION`: broad mail search included irrelevant messages and did not prove full mailbox coverage.
- `HUMAN_RECOVERY_LOAD`: user had to identify and correct multiple issues.
- `ATTACHMENT_COVERAGE`: available extraction did not prove every attachment was reviewed.

## Use restrictions

This is a **retrospective case study**, not a reproducible leaderboard run. The score was assigned after the work, without preregistration or independent review. Use it to develop the rubric and identify failure modes; do not rank models with it.

To qualify for formal evaluation, build a resettable de-identified world, capture all tool events through a controlled gateway, freeze a rubric before runs, test both invalid and valid alternative trajectories, and obtain independent review.