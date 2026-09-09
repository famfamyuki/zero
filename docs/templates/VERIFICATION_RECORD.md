# Verification record template

- Packet / authorized maintenance scope:
- Owner / role (C01 self-check or W01 independent verification):
- Live main SHA and observation time (or cached-only / unknown):
- Candidate commit / tree:
- Local source fingerprint and dirty state, if uncommitted:
- Node version / operating system / lockfile:
- AC → command or scenario → result:
- Required checks: docs, tests, typecheck, build, local secret signatures:
- Browser scenarios / viewport / locale / observed result:
- External evaluations: approved budget, dataset/model version, actual result or not run:
- QA-approved revision / released revision / comparison (W01/release only):
- Production deployment SHA / target / alias / actual smoke / runtime errors (W01 only):
- Remaining blocker, next owner, and exact required input:
- Repeated failure: cause → durable prevention → owner → closure evidence:

Never include credentials, raw provider payloads, customer data, authenticated
browser storage, or financial identifiers. Evidence is scoped to its observed
revision/environment. A local passing record is not a signed approval.
