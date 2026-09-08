import { preflight } from './harness-state.mjs';

try {
  console.log(JSON.stringify(preflight(process.cwd()), null, 2));
} catch {
  console.error('Preflight failed: run inside a complete AgentGraph Studio Git checkout. No environment values were printed.');
  process.exitCode = 1;
}
