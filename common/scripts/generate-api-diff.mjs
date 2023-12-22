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
import { exec } from './lib/exec.mjs';
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
]

async function main() {
  let wasSuccessful = true;
  await setup();
  try {
    await generateApiJsons();
  } catch (e) {
    wasSuccessful = false;
    console.error(e);
  } finally {
    await cleanup();
  }

  if (!wasSuccessful) {
    exit(-1);
  }
}

/** To be called at the beginning of the script to backup the files that will be modified by the build process */
async function setup() {
  // Clean any existing results first
  if (fs.existsSync(destinationDir)) {
    fs.rmSync(destinationDir, { recursive: true });
  }

  backupFiles(filesToBackup);
}

/** To be called at the end of the script to restore the files that were modified by the build process */
async function cleanup() {
  restoreFiles(filesToBackup);
}

/**
 * Generate the baseline.api.json and feature.api.json files.
 */
async function generateApiJsons() {
  // Store the active development flavor to restore to once the cmd finishes
  const initialDevelopmentFlavor = getBuildFlavor();

  const { feature } = parseArgs(process.argv);
  const { features, inProgressFeatures, stabilizedFeatures } = featureDefinitions;

  if (stabilizedFeatures.includes(feature)) {
    console.error(`ERROR: Feature ${feature} is already stabilized. Please use a beta feature.`);
    exit(-1);
  }

  if (!features.includes(feature)) {
    console.error(`ERROR: Could not find beta feature "${feature}" in features.js file.`);
    exit(-1);
  }

  backupFiles(filesToBackup);

  const isAlphaFeature = inProgressFeatures.includes(feature);

  if (isAlphaFeature) {
    await exec('rush switch-flavor:beta-release');
  } else {
    await exec('rush switch-flavor:stable');
  }

  modifyFeatureDefinitionsFile(feature, isAlphaFeature ? 'alphaToBeta' : 'betaToStable');
  console.log(`Generating baseline.api.json file`);
  const baselineFilePath = await generateApiFile(false);

  modifyFeatureDefinitionsFile(feature, isAlphaFeature ? 'betaToAlpha' : 'stableToBeta');
  console.log(`Generating feature.api.json file`);
  const featureFilePath = await generateApiFile(true);

  // restore the flavor
  await exec(`rush switch-flavor:${initialDevelopmentFlavor}`);

  console.log(`Done generating api.json files, files can be found at:`);
  console.log(`  - ${baselineFilePath}`);
  console.log(`  - ${featureFilePath}`);
  console.log(`Please upload these files to apiview.dev for review.`);
}

/**
 * Modify the babelrc file to enable/disable beta features.
 *
 * @param {string} option - The option to modify the babelrc file with
 * @returns {Promise<void>}
 * @example
 * `modifyFeatureDefinitionsFile(featureName, 'alphaToBeta')`
 * `modifyFeatureDefinitionsFile(featureName, 'betaToAlpha')`
 * `modifyFeatureDefinitionsFile(featureName, 'betaToStable')`
 * `modifyFeatureDefinitionsFile(featureName, 'stableToBeta')`
 */
async function modifyFeatureDefinitionsFile(feature, option) {

  const adjustedFeatureDefinitions = { ...featureDefinitions };
  switch (option) {
    case 'alphaToBeta':
      // delete from array:
      adjustedFeatureDefinitions.inProgressFeatures = adjustedFeatureDefinitions.inProgressFeatures.filter(
        (f) => f !== feature
      );
      break;
    case 'betaToAlpha':
      // add to array:
      adjustedFeatureDefinitions.inProgressFeatures.push(feature);
      break;
    case 'betaToStable':
      // delete from array:
      adjustedFeatureDefinitions.features = adjustedFeatureDefinitions.features.filter((f) => f !== feature);
      // add to array:
      adjustedFeatureDefinitions.stabilizedFeatures.push(feature);
      break;
    case 'stableToBeta':
      // delete from array:
      adjustedFeatureDefinitions.stabilizedFeatures = adjustedFeatureDefinitions.stabilizedFeatures.filter(
        (f) => f !== feature
      );
      // add to array:
      adjustedFeatureDefinitions.features.push(feature);
      break;
    default:
      console.error(`ERROR: Invalid option "${option}" provided to modifyFeatureDefinitionsFile()`);
      exit(-1);
  }

  const featureDefinitionsFile = path.join(__dirname, '../config/babel/features.js');
  fs.writeFileSync(featureDefinitionsFile, `module.exports = ${JSON.stringify(adjustedFeatureDefinitions, null, 2)};`);
}

/**
 * @returns {Promise<string>} The path to the generated api.json file
 */
async function generateApiFile(isBaseline) {
  await exec('rush build -o @azure/communication-react');
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const destinationFile = `${destinationDir}/${isBaseline ? 'baseline.api.json' : 'feature.api.json'}`;
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
        describe: 'Feature name to generate api files for. This should match the name in the babelrc file'
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
