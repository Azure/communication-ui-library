#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs/yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKLET_ROOT = path.join(__dirname, '..');
const TEST_ROOT = path.join(PACKLET_ROOT, 'tests', 'browser');
const TESTS = {
  hermetic: {
    call: path.join(TEST_ROOT, 'call', 'hermetic'),
    chat: path.join(TEST_ROOT, 'chat', 'fake-adapter')
  },
  live: {
    call: path.join(TEST_ROOT, 'call', 'live'),
    chat: path.join(TEST_ROOT, 'chat', 'live-tests'),
    callWithChat: path.join(TEST_ROOT, 'callWithChat')
  }
};
const PLAYWRIGHT_CONFIG = {
  hermetic: path.join(PACKLET_ROOT, 'playwright.config.hermetic.ts'),
  live: path.join(PACKLET_ROOT, 'playwright.config.live.ts')
};

async function main(argv) {
  const args = parseArgs(argv);
  for (const composite of args.composites) {
    await runOne(args, composite, 'hermetic');
  }
  if (!args.hermeticOnly) {
    for (const composite of args.composites) {
      await runOne(args, composite, 'live');
    }
  }
}

async function runOne(args, composite, hermeticity) {
  const test = TESTS[hermeticity][composite];
  if (!test) {
    return;
  }

  const env = {
    ...process.env,
    COMMUNICATION_REACT_FLAVOR: args.buildFlavor
  };

  const cmdArgs = ['npx', 'playwright', 'test', '-c', PLAYWRIGHT_CONFIG[hermeticity], test];
  if (args.update) {
    cmdArgs.push('--update-snapshots');
  }
  cmdArgs.push(...args['_']);

  const cmd = cmdArgs.join(' ');
  console.log(`Running: ${cmd}`);
  if (!args.dryRun) {
    await exec(cmd, env, 'playwright');
  }
}

async function exec(cmd, env) {
  const ls = child_process.exec(cmd, { env: env });
  ls.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  return new Promise((resolve, reject) => {
    ls.on('exit', (code) => {
      if (code != 0) {
        reject(`Child exited with non-zero code: ${code}`);
      }
      resolve();
    });
    ls.on('error', (err) => {
      reject(`Child failed to start: ${err}`);
    });
  });
}

function parseArgs(argv) {
  const args = yargs(argv.slice(2))
    .usage(
      '$0 [options]',
      'Use this script to run end to end tests for this packlet.' +
        '\nThis script invokes playwright with packlet specific configuration & flags.'
    )
    .example([
      ['$0 -l', 'Run only hermetic tests. Most useful for local development cycle.'],
      ['$0 -c call', 'Run only CallComposite tests. Used by CI to shard out tests by composite.'],
      [
        '$0 -b stable',
        'Run tests for stable flavor build. You can also set the COMMUNICATION_REACT_FLAVOR as is done by package.json invocations.'
      ]
    ])
    .options({
      buildFlavor: {
        alias: 'b',
        type: 'string',
        choices: ['beta', 'stable'],
        describe:
          'Run tests against the specified build flavor.' +
          ' Default: `beta`' +
          ' Overrides the COMMUNICATION_REACT_FLAVOR environment variable.\n'
      },
      composites: {
        alias: 'c',
        type: 'array',
        choices: ['call', 'chat', 'callWithChat'],
        describe: 'One or more composites to test. By default, all composites will be tested.\n'
      },
      dryRun: {
        alias: 'n',
        type: 'boolean',
        describe: 'Print what tests would be run without invoking test harness.'
      },
      hermeticOnly: {
        alias: 'l',
        type: 'boolean',
        default: false,
        describe: 'Run only hermetic tests. By default both hermetic and live tests will be run.\n'
      },
      update: {
        alias: 'u',
        type: 'boolean',
        default: false,
        describe: 'Update the test snapshots. In this mode, snapshot conflicts to not cause test failures.\n'
      }
    })
    .parseSync();

  if (!args.buildFlavor) {
    args.buildFlavor = process.env['COMMUNICATION_REACT_FLAVOR'] || 'beta';
  }
  if (!args.composites) {
    args.composites = ['call', 'chat', 'callWithChat'];
  }
  return args;
}

await main(process.argv);
