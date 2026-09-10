# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-09-10**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise top-level lifecycle, blocker, authority state, and scoped evidence needed to understand where development stands.

This file is intentionally **not** a deployment registry, near-term execution plan,
roadmap, packet copy, risk register, or release-history archive.
`docs/roadmap/PROGRAM_BOARD.md` owns the active execution sequence and blocker
routing.

## 0. Live-state rule

Before Product/Architecture/Roadmap, implementation, QA, release, or current-state
decisions, re-check as applicable:

1. latest GitHub `main` / repository reality;
2. latest Vercel Production deployment and actual Production behavior;
3. authoritative active packet under `docs/specs/`;
4. durable Product / Architecture / Development / Roadmap authorities;
5. `docs/roadmap/PROGRAM_BOARD.md` and `docs/roadmap/RISK_REGISTER.md`;
6. this snapshot;
7. ADRs / historical chats / old SHAs.

**Do not persist a mutable GitHub-main or latest-deployment identity here as a
current claim.** Updating this documentation can advance `main` and immediately
make such a claim stale. Obtain live identity from GitHub/Vercel when the decision
requires it. Scoped historical release identities may remain below when they are
necessary evidence for a specific lifecycle distinction.

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

The documentation/context consolidation series beginning with PR #43 changes
routing/authority organization only. It does not change application, evaluator,
provider, billing, entitlement, quota, or runtime behavior. Exact current main and
Production deployment identity must still be live-checked rather than inferred
from this statement.

The deterministic free core remains protected independently of paid/provider
availability, including Builder/Design, Templates, AgentGraph JSON Import/Export,
CrewAI Static Import entrypoint, Readiness, Execution Preview, Resource Analysis,
Unified Preflight, and deterministic CrewAI Python export.

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

---

# 2. Current lifecycle summary

`PROGRAM_BOARD.md` is authoritative for the full execution sequence. The current
summary is:

```text
Commercial-enablement preparation release
= MERGED / PAID-OFF PRODUCTION VERIFIED

Stage 1 Architecture Review + Paid Access public-launch lifecycle
= OPEN
= Production paid Architecture Review DISABLED / FAIL-CLOSED
= PAUC AC-30 NOT COMPLETE
= current commercial Sprint NOT COMPLETE

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

Provider-backed Architecture Review remains restricted to authenticated active paid
entitlement plus remaining server-enforced quota when the paid path is enabled.
The provisional launch configuration remains USD 12/month and 10 reviews per
confirmed monthly Stripe billing period. These are launch configuration, not M0
commercial-validation evidence or permanent Product constants.

The active blocker remains:

```text
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER
Related durable risks: R-008 / R-020 / R-021
```

Item-level prerequisites, first-launch procedure gaps, owner routing, Phase G/H
sequencing, and next handoff live only in `docs/roadmap/PROGRAM_BOARD.md` and the
paid-launch runbook. Do not copy them back into this snapshot.

---

# 3. PR #35 scoped release evidence baseline

This section is retained because current coordination must distinguish the
already-verified paid-off preparation release from the still-open paid launch. It is
historical scoped evidence, **not** today's main or deployment identity.

```text
PR #35
= MERGED

W01 Pass A approved candidate
= 107f2db9ac7d9b4f6c02f708ebe7a343b14b00ed

PR #35 released commit at W01 Pass B
= 6c026189657c8211dd1b5922119a252d3335e705

Candidate/released tree
= b0a8dad3d05b8220025d401f6fdf9ba508b32b63

Candidate-to-released-main file diff
= EMPTY

W01-verified Production deployment for that scoped release
= dpl_8we4kQoxMRXhGCdzccpNK81P2H6i
= READY
= target=production
= then-current released main matched githubCommitSha

Architecture Review offer at that verification
= enabled=false
= price=null
= includedReviews=null
= policyUrls=null

W01 result
= PASS_B_WITH_NOTES
```

Meaning preserved:

`Preparation release Production Verified ≠ Paid Access AC-30 Production Verified`.
The preparation milestone does not close the selected paid-launch packet, satisfy
M0, promote Gate A, select Stage 1.5, expand AI Authority, or expand Mutation
Authority.

---

# 4. Current next authority

Use `docs/roadmap/PROGRAM_BOARD.md` for the exact current next action and evidence
matrix. At this snapshot, the selected paid-launch lifecycle remains blocked on
external/commercial Production readiness plus the documented first-launch procedure
gap. Keep Production paid Architecture Review fail-closed until the authoritative
procedure/prerequisite evidence permits controlled enablement.

The durable handoff remains conceptually:

```text
01 / 02 resolve any required first-launch decision/specification gap
→ C01 performs only authorized implementation/release actions
→ W01 independently verifies applicable live paid behavior / AC-30
→ 00 considers Sprint Complete
→ 01 performs Evidence → Gate Review → Explicit Next Selection
```

Do not infer an automatic next Stage from Sprint completion.

---

# 5. Known / Inferred / Unknown

## Known

- the documentation/context consolidation does not change Product/runtime behavior;
- the paid-off preparation sub-release remains scoped Production Verified;
- the real paid Production path remains outside that scoped verification and AC-30 remains open;
- Gate A / M0 are not reached; Stage 1.5/Stage 2 are not selected;
- AI Authority and Mutation Authority are unchanged;
- exact live GitHub/Vercel identity is deliberately obtained from live systems rather than this snapshot.

## Inferred

- keeping the preparation code deployed while the paid offer stays fail-closed can
  reduce release coupling without weakening the launch gate, provided later
enablement still follows the authoritative runbook, Program Board, and fresh
verification requirements.

## Unknown / evidence-dependent

The unresolved external/prerequisite and live paid-path evidence is owned by
`PROGRAM_BOARD.md`, `RISK_REGISTER.md`, the active packets, and the paid-launch
runbook. Unknown means insufficient evidence, not evidence of absence.

---

# 6. Snapshot discipline

Update this file only when a **small number of stable coordination facts**
materially change: top-level lifecycle, blocker, authority state, or scoped release
evidence needed to disambiguate current coordination.

Do not duplicate:

- latest mutable main/deployment identity;
- Phase-by-phase execution plans;
- item-level prerequisite/evidence matrices;
- full risk definitions;
- packet Acceptance Criteria;
- roadmap stages;
- commercial architecture;
- transient Preview deployments;
- historical chat narratives.

Those belong to live systems or their canonical owners. This keeps current-state
lookup cheap and resistant to stale-context errors for Astra/Codex while preserving
the full development plan elsewhere.
