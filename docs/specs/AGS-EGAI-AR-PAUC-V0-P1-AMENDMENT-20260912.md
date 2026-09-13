# AGS-EGAI-AR-PAUC-V0-P1 — Current-State Classification Amendment

Status: **Specified amendment**  
Owner: `02 — UX & Implementation Specification`  
Base packet: `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md`  
Scope: current-state classification and Development Governance routing only.

This amendment preserves the complete base PAUC contract and changes no Product behavior, Acceptance Criterion, AI Authority, Mutation Authority, billing/quota semantics, security/data boundary, or release gate.

## 1. Provisional launch configuration is Known

The base packet contains historical wording that still lists public price/currency and included quota among “remaining Unknowns.” That classification is superseded for the current selected launch configuration.

Current Known provisional configuration:

```text
Public base price = USD 12.00 / month
Included quota = 10 valid Architecture Reviews / confirmed monthly Stripe billing period
```

These values remain **provisional launch configuration**, not permanent Product constants and not Commercial Validation Gate M0 evidence. Actual Stripe Live Price configuration, launch operations readiness, and Production verification remain evidence-dependent prerequisites.

Accordingly:

- `$12/month` and `10 reviews` are Known as the selected provisional configuration;
- whether Live external configuration and operational prerequisites are correctly established remains Unknown until verified;
- M0 commercial validation remains NOT REACHED;
- C01 still must not invent or change commercial policy.

## 2. Current Development Governance authority

Where the base packet cites `ENGINEERING_EXECUTION_GOVERNANCE` as a current authority, read that reference as `docs/DEVELOPMENT_RULES.md`.

`docs/ENGINEERING_EXECUTION_GOVERNANCE.md` is retained only as a compatibility pointer for historical links and is not a second current authority.

This specifically applies to Definition of Ready, version lifecycle, traceability, operational-quality maturity, repository/docs enforcement, accessibility/responsive engineering requirements, QA, and release governance.

## 3. First-Live procedure routing

The historical classification that the first-launch circular dependency was procedurally unresolved is superseded **only for procedure definition** by:

- `docs/decisions/ADR-0011-edge-contained-first-live-bootstrap.md`;
- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1-FIRST-LIVE-AMENDMENT-20260913.md`;
- `docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md`.

The first-Live procedure is now specified as a QA-only edge-contained sequence. Actual execution remains blocked until the amendment/runbook Phase 0 external prerequisites and W01 containment proof are complete. `Specified` therefore does not mean paid Production is enabled or currently safe to enable.

At the time the 2026-09-13 first-Live amendment was authored, ADR-0011 was carried by PR #58 and was not yet merged to `main`; the first-Live amendment is intentionally dependent on that accepted 01 decision and must not be merged ahead of it.

## 4. Preserved boundaries

Unchanged:

- provider-backed Architecture Review remains paid-entitlement-only and fail-closed outside explicitly authorized QA-contained Live windows;
- provisional price/quota do not authorize public paid enablement;
- PAUC AC-01..31 remain intact;
- deterministic free core remains independent of paid/provider failure;
- Stage 1 remains `AE1 — Review`;
- no semantic mutation is authorized;
- AC-30 still requires real Production evidence;
- first-Live bootstrap evidence does not mark AC-30 complete early;
- Production Verified does **not** satisfy M0 or promote roadmap/AI/Mutation authority.

The Program Board packet index must route current PAUC decisions through the base packet plus applicable scoped amendments. The first-Live operational amendment is authoritative only for the circular bootstrap procedure and does not rewrite historical preparation/release evidence.