import { spawn } from 'node:child_process';
import { isolatedCheckEnv } from './harness-state.mjs';

// Never inherit real provider/billing credentials into the smoke server.
const env = isolatedCheckEnv(process.cwd());
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3107'], { stdio: 'inherit', env });
child.on('error', () => { console.error('Local smoke server failed to start.'); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
