const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);

const hasCoverage = args.includes('--coverage');

const vitestArgs = ['vitest', 'run', '--config', 'vitest.config.mts'];

if (hasCoverage) {
  vitestArgs.push('--coverage');
}

// --shard=M/N forwarded verbatim (Vitest supports it natively)
for (const arg of args) {
  if (arg.startsWith('--shard=') || arg.startsWith('--shard ')) {
    vitestArgs.push(arg);
  }
}

const result = spawnSync('npx', vitestArgs, {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
