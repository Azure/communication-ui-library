#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { exec, getBuildFlavor } from './common.mjs';
import path from 'path';
import { rmdirSync } from 'fs';
import { quote } from 'shell-quote';
import { fileURLToPath } from 'url';
import yargs from 'yargs/yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKLET_ROOT = path.join(__dirname, '..');
const BASE_OUTPUT_DIR = path.join(PACKLET_ROOT, 'test-results');
const TEST_ROOT = path.join(PACKLET_ROOT, 'tests', 'browser');
const TESTS = {
  hermetic: {
    call: path.join(TEST_ROOT, 'call', 'hermetic'),
    chat: path.join(TEST_ROOT, 'chat', 'hermetic'),
    callWithChat: path.join(TEST_ROOT, 'callwithchat', 'hermetic')
  },
  live: {
    call: path.join(TEST_ROOT, 'call', 'live'),
    chat: path.join(TEST_ROOT, 'chat', 'live'),
    callWithChat: path.join(TEST_ROOT, 'callwithchat', 'live')
  }
};
const PLAYWRIGHT_CONFIG = {
  hermetic: path.join(PACKLET_ROOT, 'playwright.config.hermetic.ts'),
  live: path.join(PACKLET_ROOT, 'playwright.config.live.ts')
};
const PLAYWRIGHT_PROJECT = {
  desktop: 'Desktop Chrome',
  'mobile-portrait': 'Mobile Android Portrait',
  'mobile-landscape': 'Mobile Android Landscape'
};

async function main(argv) {
  const args = parseArgs(argv);
  setup();
  if (args.stress) {
    await runStress(args);
  } else {
    await runAll(args);
  }
}

async function runStress(args) {
  let failureCount = 0;
  for (let i = 0; i < args.stress; i++) {
    try {
      await runAll(args);
    } catch (e) {
      failureCount += 1;
      console.log('Test failed with', e);
    }
  }
  console.log(`### STRESS TEST ${args.stress - failureCount} succeeded out of ${args.stress} attempts ###`);
  if (failureCount > 0) {
    throw new Error('stress test failed');
  }
}

async function runAll(args) {
  let success = true;
  for (const composite of args.composites) {
    try {
      await runOne(args, composite, 'hermetic');
    } catch (e) {
      if (args.failFast) {
        throw e;
      }
      console.error(`Hermetic tests failed for ${composite} composite: `, e);
      success = false;
    }
  }
  if (!args.hermeticOnly) {
    for (const composite of args.composites) {
      try {
        await runOne(args, composite, 'live');
      } catch (e) {
        if (args.failFast) {
          throw e;
        }
        console.error(`Live tests failed for ${composite} composite: `, e);
        success = false;
      }
    }
  }
  if (!success) {
    throw new Error('Some tests failed!');
  }
}

async function runOne(args, composite, hermeticity) {
  const test = TESTS[hermeticity][composite];
  if (!test) {
    return;
  }

  const env = {
    ...process.env,
    COMMUNICATION_REACT_FLAVOR: getBuildFlavor(),
    PLAYWRIGHT_OUTPUT_DIR: path.join(BASE_OUTPUT_DIR, Date.now().toString())
  };

  const cmdArgs = ['npx', 'playwright', 'test', '-c', PLAYWRIGHT_CONFIG[hermeticity], test];
  if (args.update) {
    cmdArgs.push('--update-snapshots');
  }
  if (args.projects) {
    for (const project of args.projects) {
      cmdArgs.push('--project', PLAYWRIGHT_PROJECT[project]);
    }
  }
  if (args.debug) {
    cmdArgs.push('--debug');
    env['LOCAL_DEBUG'] = true;
  }
  if (args.failFast) {
    cmdArgs.push('-x');
  }
  cmdArgs.push(...args['_']);

  const cmd = quote(cmdArgs);
  if (args.dryRun) {
    console.log(`DRYRUN: Would have run ${cmd}`);
  } else {
    await exec(cmd, env);
  }
}

function setup() {
  console.log('Cleaning up output directory...');
  rmdirSync(BASE_OUTPUT_DIR, { recursive: true });
}

function parseArgs(argv) {
  const args = yargs(argv.slice(2))
    .usage(
      '$0 [options]',
      'Use this script to run end-to-end tests for this packlet.' +
        '\nThis script invokes playwright with packlet specific configuration & flags.' +
        '\n\nAll arguments after `--` are forwarded to `playwright`.'
    )
    .example([
      ['$0 -l', 'Run only hermetic tests. Most useful for local development cycle.'],
      ['$0 -c call', 'Run only CallComposite tests. Used by CI to shard out tests by composite.'],
      [
        'rush switch-flavor:stable && $0',
        'Run tests for stable flavor build. This tool respects the build flavor set via `rush`.'
      ],
      [
        '$0 -- --debug',
        'Run `playwright` in debug mode with Playwright inspector. This is the recommended way to debug e2e tests.'
      ],
      [
        '$0 -c call -p desktop -s 10',
        'Run CallComposite tests on Desktop Chrome 10 times and report success count. Usually a single test should be enabled using `test.only`.'
      ]
    ])
    .options({
      composites: {
        alias: 'c',
        type: 'array',
        choices: ['call', 'chat', 'callWithChat'],
        describe: 'One or more composites to test. By default, all composites will be tested.\n'
      },
      debug: {
        alias: 'd',
        type: 'boolean',
        describe:
          'Run in debug mode.\n' +
          'Launches playwright inspector and relaxes timeouts to allow single stepping through the test.\n' +
          'This mode must be used on a machine with display support.'
      },
      dryRun: {
        alias: 'n',
        type: 'boolean',
        describe: 'Print what tests would be run without invoking test harness.'
      },
      failFast: {
        alias: 'x',
        type: 'boolean',
        describe: 'Stop execution on first failure. Preferred over passing `-x` directly to playwright.'
      },
      hermeticOnly: {
        alias: 'l',
        type: 'boolean',
        default: false,
        describe: 'Run only hermetic tests. By default both hermetic and live tests will be run.\n'
      },
      projects: {
        alias: 'p',
        type: 'array',
        choices: ['desktop', 'mobile-portrait', 'mobile-landscape'],
        description: 'Choose playwright projects to run. By default, all projects will be run.\n'
      },
      stress: {
        alias: 's',
        type: 'number',
        describe:
          'Repeat execution a number of times and report failure count. Useful for stabilizing a new / flakey test.\n' +
          'You should to enable just one test to stress via `test.only`.\n'
      },
      update: {
        alias: 'u',
        type: 'boolean',
        default: false,
        describe: 'Update the test snapshots. In this mode, snapshot conflicts do not cause test failures.\n'
      }
    })
    .parseSync();

  if (!args.composites) {
    args.composites = ['call', 'chat', 'callWithChat'];
  }
  return args;
}

await main(process.argv);
