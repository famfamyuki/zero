# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-09-13**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise top-level lifecycle, blocker, authority state, and scoped evidence needed to understand where development stands.

This file is intentionally **not** a deployment registry, near-term execution plan, roadmap, packet copy, risk register, or release-history archive. `docs/roadmap/PROGRAM_BOARD.md` owns the active execution sequence and blocker routing.

## 0. Live-state rule

Before Product/Architecture/Roadmap, implementation, QA, release, or current-state decisions, re-check as applicable:

1. latest GitHub `main` / repository reality;
2. latest Vercel Production deployment and actual Production behavior;
3. authoritative active packet under `docs/specs/`;
4. durable Product / Architecture / Development / Roadmap authorities;
5. `docs/roadmap/PROGRAM_BOARD.md` and `docs/roadmap/RISK_REGISTER.md`;
6. this snapshot;
7. ADRs / historical chats / old SHAs.

Do not persist a mutable GitHub-main or latest-deployment identity here as a current claim. Scoped historical release identities may remain when needed to distinguish lifecycle evidence.

Canonical owners:

- Product → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- Development Governance → `docs/DEVELOPMENT_RULES.md`
- roles/lifecycle ownership → `docs/CHAT_ROLE_REGISTRY.md`
- roadmap sequence → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI / Mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- current execution / packet index / blocker ownership → `docs/roadmap/PROGRAM_BOARD.md`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- commercial value/pricing/launch contract → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`

---

# 1. Stable current-state facts

The deterministic free core remains protected independently of paid/provider availability, including Builder/Design, Templates, AgentGraph JSON Import/Export, CrewAI Static Import entrypoint, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python export.

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

The bounded `GPT-6 Astra Challenge Launch Hardening` packet is now **Sprint Complete / Production Verified**. Its scope remained current free-core first-value clarity, coherent demonstration, truthful launch presentation, accessibility/responsive hardening, and changed-path release confidence. It did not change the durable Product definition, paid lifecycle, roadmap stage status, AI Authority, or Mutation Authority.

The 2026-09-13 post-Astra `01` review completed `Evidence → Gate Review → Explicit Next Selection` and selected **no new capability / no new roadmap packet**. The already-selected Stage 1 Architecture Review / Paid Access lifecycle remains the next dependency to close.

---

# 2. Current lifecycle summary

`PROGRAM_BOARD.md` is authoritative for the full execution sequence. The current summary is:

```text
Commercial-enablement preparation release
= MERGED / PAID-OFF PRODUCTION VERIFIED

Stage 1 Architecture Review + Paid Access public-launch lifecycle
= OPEN
= Production paid Architecture Review DISABLED / FAIL-CLOSED
= first-Live procedure specification + external prerequisites PENDING
= PAUC AC-30 NOT COMPLETE
= current commercial Sprint NOT COMPLETE

GPT-6 Astra Challenge Launch Hardening
= SPRINT COMPLETE / PRODUCTION VERIFIED
= W01 PASS WITH NOTES

Post-Astra Gate Review
= COMPLETE
= NO NEW CAPABILITY / NO NEW ROADMAP PACKET SELECTED

Commercial Validation Gate M0
= NOT REACHED

Gate A
= NOT REACHED

Additional Stage 1.5 capability
= NONE SELECTED

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

Provider-backed Architecture Review remains restricted to authenticated active paid entitlement plus remaining server-enforced quota when the paid path is enabled. The provisional launch configuration remains USD 12/month and 10 reviews per confirmed monthly Stripe billing period. These are launch configuration, not M0 evidence or permanent Product constants.

The active commercial blocker remains:

```text
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER
Related durable risks: R-008 / R-020 / R-021
```

`01` has resolved the Product/Architecture sequencing part of the first-Live circular dependency in `docs/decisions/ADR-0011-edge-contained-first-live-bootstrap.md`: after all independently satisfiable prerequisites are verified, the first legitimate Live entitlement must be acquired through the normal Production Auth/application Checkout/signed webhook path inside a QA-only edge-contained window, followed by a fail-closed entitled kill-switch proof and a second contained cost-guard proof before the existing AC-30 flow proceeds. This decision authorizes specification of the safe sequence, not public paid enablement.

Exact procedure details and item-level prerequisite evidence remain owned by `PROGRAM_BOARD.md`, the PAUC packet, and the paid-launch runbook.

---

# 3. Scoped release evidence baselines

These are historical scoped evidence, **not** today's mutable main/deployment identity.

## 3.1 Commercial-enablement preparation release — PR #35

```text
W01 Pass A approved candidate
= 107f2db9ac7d9b4f6c02f708ebe7a343b14b00ed

Released commit at W01 Pass B
= 6c026189657c8211dd1b5922119a252d3335e705

Candidate/released tree
= b0a8dad3d05b8220025d401f6fdf9ba508b32b63

W01 result
= PASS_B_WITH_NOTES
= paid-off preparation milestone only
```

Meaning preserved: `Preparation release Production Verified ≠ Paid Access AC-30 Production Verified`.

## 3.2 Astra launch-hardening release

```text
W01 Pass A approved candidate
= 5c3d6784d8b12bea48539ef1e8cd62c5000b9699

Released main at W01 Pass B
= 3cdce0161fe00d38aca8ba8e2bd0949bbc5899d0

Candidate/released tree
= 6710fba8e84e96012a0d3cf98439383ab8dc4ffe

W01-verified Production deployment
= dpl_Gu9mN3xJ61AxBZPdy2RXdKsfZ9py
= READY
= target=production
= then-current GitHub main matched githubCommitSha

W01 result
= PASS WITH NOTES / Production Verified
```

The Astra release proved the scoped deterministic/manual first-value journey and related regressions. It did not prove paid billing/entitlement/quota/provider behavior, commercial validation, evaluator promotion readiness, stronger AI authority, or mutation authority.

---

# 4. Current next authority

Use `docs/roadmap/PROGRAM_BOARD.md` for the exact current action/evidence matrix.

No new roadmap capability is Selected. The next Product-specification owner is:

```text
02 — UX & Implementation Specification
```

Exact handoff target:

```text
ADR-0011
→ amend the existing AGS-EGAI-AR-PAUC-V0-P1 / paid-launch runbook contract
→ specify the QA-only edge-contained first-Live bootstrap
→ define route scope, containment/order, operator authority, evidence,
   fail-closed/abort/re-enable conditions, financial handling,
   degraded/public UX behavior, and independent verification expectations
```

In parallel, `00` coordinates the still-required external commercial/hosting/Auth/Stripe/WAF/provider-control prerequisites. Production paid Architecture Review remains fail-closed until the authoritative procedure and prerequisite evidence allow each controlled step.

The durable paid-path handoff is:

```text
02 procedure specification
+ 00 external prerequisite closure
→ applicable independent review
→ C01 / authorized operators perform only specified actions
→ W01 live paid Production Verification / AC-30
→ 00 commercial Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Do not infer an automatic next Stage from Astra completion or eventual commercial enablement.

---

# 5. Known / Inferred / Unknown

## Known

- the paid-off preparation release is scoped Production Verified;
- the real paid Production path remains outside that scoped verification and AC-30 remains open;
- Astra launch hardening is Sprint Complete / Production Verified;
- Astra completion did not satisfy M0, Gate A, Gate B, or select Stage 1.5/Stage 2;
- AI Authority and Mutation Authority are unchanged;
- the post-Astra `01` decision selected no new capability;
- ADR-0011 resolves the Product/Architecture sequencing boundary for first-Live bootstrap, while the operational specification and prerequisite evidence remain incomplete;
- exact live GitHub/Vercel identity must still be obtained from live systems for future decisions.

## Inferred

- a QA-only edge-contained Live bootstrap can preserve fail-closed public behavior while allowing the existing real billing/entitlement path to generate the missing legitimate Live entitlement evidence, provided containment and external prerequisites are independently verified before each controlled step;
- keeping deterministic free-core operation independent from the paid/provider path continues to reduce commercial-release risk without weakening AC-30.

## Unknown / evidence-dependent

- external commercial approvals and account/operator readiness remain evidence-dependent;
- current hosting commercial-use eligibility remains unresolved until independently verified/approved;
- Production WAF/provider-control configuration is not inferred from platform capability;
- dependency-audit exploitability/reachability remains unestablished by the Astra packet;
- live analytics transport was not proven by the Astra browser verification and must not be treated as M0 activation/conversion evidence until verified;
- screen-reader speech and a full physical-device matrix were not verified by the Astra packet.

Unknown means insufficient evidence, not evidence of absence.

---

# 6. Snapshot discipline

Update this file only when a small number of stable coordination facts materially change: top-level lifecycle, blocker, authority state, or scoped release evidence needed to disambiguate current coordination.

Do not duplicate latest mutable main/deployment identity, Phase-by-phase execution plans, item-level prerequisite matrices, full risk definitions, packet AC, roadmap stages, commercial architecture, transient Preview deployments, or historical chat narratives. Those belong to live systems or their canonical owners.
