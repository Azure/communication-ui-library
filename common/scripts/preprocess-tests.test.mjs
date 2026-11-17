// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import { EventEmitter } from 'node:events';
import { test } from 'node:test';

async function runForFlavor(t, flavor, exitCode = 0) {
  const previous = process.env.COMMUNICATION_REACT_FLAVOR;
  t.after(() => {
    if (previous === undefined) {
      delete process.env.COMMUNICATION_REACT_FLAVOR;
    } else {
      process.env.COMMUNICATION_REACT_FLAVOR = previous;
    }
  });
  process.env.COMMUNICATION_REACT_FLAVOR = flavor;
  const spawn = t.mock.method(childProcess, 'spawn', () => {
    const child = new EventEmitter();
    queueMicrotask(() => child.emit('exit', exitCode));
    return child;
  });
  await import(`./preprocess-tests.mjs?flavor=${flavor}&exit=${exitCode}`);
  return spawn.mock.calls;
}

test('beta does not run preprocessing', async (t) => {
  assert.equal((await runForFlavor(t, 'beta')).length, 0);
});

for (const flavor of ['stable', 'beta-release']) {
  test(`${flavor} runs preprocessing before completing`, async (t) => {
    const calls = await runForFlavor(t, flavor);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].arguments[0], 'rushx preprocess');
  });
}

test('a preprocessing failure stops the test preparation', async (t) => {
  await assert.rejects(runForFlavor(t, 'stable', 7), (error) => error === 'Child exited with non-zero code: 7');
});
