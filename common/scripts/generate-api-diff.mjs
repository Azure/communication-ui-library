#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This script is used to generate api.json files for beta features for uploading to apiview.dev for review.
 * This generates two files:
 *   1. baseline.api.json - the api.json file with the beta feature removed
 *   2. feature.api.json - the api.json file with the beta feature enabled
 *
 * @example
 * `node ./generate-api-diff.mjs --feature nameOfFeature`
 */

import { exit } from 'process';
import yargs from 'yargs/yargs';
import featureDefinitions from '../config/babel/features.js';
import { exec as execInternal } from './lib/exec.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getBuildFlavor } from './lib/getBuildFlavor.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const destinationDir = path.join(__dirname, '../../apis');

// This process runs the build and api generate commands locally.
// So this process backs up the files that will be modified by the build process
// and restores them after the build process is complete.
const filesToBackup = [
  path.join(__dirname, '../../packages/communication-react/review/beta/communication-react.api.md'),
  path.join(__dirname, '../../packages/communication-react/review/stable/communication-react.api.md'),
  path.join(__dirname, '../config/babel/features.js')
];

// This process runs the build and api generate commands locally.
// During this process, the development flavor is switched to beta-release and/or stable.
// This variable is used to store the initial development flavor to restore to once the cmd finishes.
let initialDevelopmentFlavor = undefined;

// This variable is used to store the commands that were run during the process.
// This is used to display the commands that were run in the logs in the event of an error
// to allow the developer to easily reproduce the error.
let commandsRun = []

async function main() {
  let result = undefined;
  await setup();

  try {
    result = await generateApiJsons();
  } catch (e) {
    console.error(e);
  } finally {
    await cleanup();
  }

  // Ouput the result of the process _after_ the cleanup process has run to ensure the logs are not lost
  if (result) {
    console.log(`\nDone generating api.json files, files can be found at:`);
    console.log(`  - ${result.baselineFilePath}`);
    console.log(`  - ${result.featureFilePath}`);
    console.log(`Please upload these files to https://apiview.dev/ for review.`);
  } else {
    console.error(`\nScript failed to generate api.json files.\nInspect the logs above for more information on errors.\nAlternatively, this tool ran the following commands that you can run locally to reproduce the error: \n${commandsRun.map(c => `  - ${c}`).join('\n')}`);
    exit(1);
  }
}

/** To be called at the beginning of the script to backup the files that will be modified by the build process */
async function setup() {
  // Clean any existing results first
  if (fs.existsSync(destinationDir)) {
    fs.rmSync(destinationDir, { recursive: true });
  }

  // Backup the files that will be modified by the build process
  backupFiles(filesToBackup);

  // Store the active development flavor to restore to once the cmd finishes
  initialDevelopmentFlavor = getBuildFlavor();
}

/** To be called at the end of the script to restore the files that were modified by the build process */
async function cleanup() {
  // Restore the files that were modified by the build process
  restoreFiles(filesToBackup);

  // restore the initial development flavor used before the cmd started
  if (initialDevelopmentFlavor) {
    await execInternal(`rush switch-flavor:${initialDevelopmentFlavor}`);
  }
}

/**
 * Generate the baseline.api.json and feature.api.json files.
 */
async function generateApiJsons() {
  const { feature } = parseArgs(process.argv);
  const { alpha, beta, stable } = featureDefinitions;

  if (stable.includes(feature)) {
    console.error(`ERROR: Feature ${feature} is already stabilized. Please use a beta feature.`);
    exit(-1);
  }

  const allFeatures = [...alpha, ...beta, ...stable];
  if (!allFeatures.includes(feature)) {
    console.error(`ERROR: Could not find feature "${feature}" in features.js file.`);
    exit(-1);
  }

  const isAlphaFeature = alpha.includes(feature);

  if (isAlphaFeature) {
    await exec('rush switch-flavor:beta-release');
  } else {
    await exec('rush switch-flavor:stable');
  }

  console.log(`Generating baseline.api.json file`);
  const baselineFilePath = await generateApiFile('baseline.api.json');

  console.log(`Generating feature.api.json file`);
  exec(`rush stage-feature -f ${feature} -o ${isAlphaFeature ? 'alphaToBeta' : 'betaToStable'}`);
  const featureFilePath = await generateApiFile('feature.api.json');

  return { baselineFilePath, featureFilePath };
}

async function exec(cmd) {
  commandsRun.push(cmd);
  await execInternal(cmd);
}

/**
 * @returns {Promise<string>} The path to the generated api.json file
 */
async function generateApiFile(filename) {
  await exec('rush build -v -o @azure/communication-react');
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const destinationFile = `${destinationDir}/${filename}`;
  fs.copyFileSync(
    path.join(__dirname, '../../packages/communication-react/temp/communication-react.api.json'),
    destinationFile
  );

  return destinationFile;
}

/** Backup the files that will be modified by the build process */
function backupFiles(filepaths) {
  filepaths.forEach((file) => {
    fs.copyFileSync(file, `${file}.bak`);
  });
}

/** Restore the files that were modified by the build process */
function restoreFiles(filepaths) {
  filepaths.forEach((file) => {
    fs.copyFileSync(`${file}.bak`, file);
    fs.rmSync(`${file}.bak`);
  });
}

function parseArgs(argv) {
  const args = yargs(argv.slice(2))
    .usage('$0 [options]', 'Use this script to generate api.json files for beta features for uploading to apiview.dev for review.')
    .example([
      ['$0 --feature my-feature', 'Generate api.json files for the my-feature beta feature.']
    ])
    .options({
      feature: {
        alias: 'f',
        type: 'string',
        describe: 'Feature name to generate api files for. This should match the name in the features.js file'
      }
    })
    .parseSync();

  if (!args.feature) {
    console.error('ERROR: Could not find feature name. Please provide a feature name using the `feature` argument.');
    exit(-1);
  }

  return args;
}

main();
