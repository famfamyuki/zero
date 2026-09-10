import { preflight } from './harness-state.mjs';

// SessionStart only. Ignore transcript/prompt fields; they may contain secrets.
try {
  const state = preflight(process.cwd());
  const flags = [];
  if (state.dirty) flags.push('DIRTY_PRESERVE');
  if (state.behind) flags.push('BEHIND_CACHED_MAIN');
  if (!state.cachedMain) flags.push('NO_CACHED_MAIN');
  if (state.node !== state.expectedNode) flags.push('NODE_MISMATCH');

  const compact = {
    head: state.head,
    branch: state.branch,
    cachedMain: state.cachedMain,
    ahead: state.ahead,
    behind: state.behind,
    dirty: state.dirty,
    flags,
  };

  console.log(JSON.stringify({ hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: 'Local Git facts only: ' + JSON.stringify(compact) + '\nCached main is not live main. Read AGENTS.md, then Program Board packet index. Preserve existing changes. verify=self-check, not W01/release. Read-only tasks stay non-mutating.',
  } }));
} catch {
  console.log(JSON.stringify({ systemMessage: 'AgentGraph preflight unavailable. Inspect the checkout before editing; do not assume current main or verification.' }));
}
