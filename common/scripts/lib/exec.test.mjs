// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exec } from './exec.mjs';

test('exec preserves literal arguments without shell expansion', async () => {
  const args = ['*/**/*.{ts,tsx,mdx}', 'a path with spaces', 'a&b'];
  await exec([
    process.execPath,
    '-e',
    `require('node:assert/strict').deepEqual(process.argv.slice(1), ${JSON.stringify(args)})`,
    ...args
  ]);
});

test('exec rejects an unsuccessful child command', async () => {
  await assert.rejects(exec([process.execPath, '-e', 'process.exit(7)']), (error) =>
    error === 'Child exited with non-zero code: 7'
  );
});

test('exec preserves existing shell command behavior', async () => {
  await exec('echo first && echo second');
});
