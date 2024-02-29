#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This script is used to promote/demote a beta feature to/from alpha or stable.
 *
 * @example
 * `node ./stage-feature.mjs --feature nameOfFeature --option alphaToBeta`
 * `node ./stage-feature.mjs -f nameOfFeature -o alphaToBeta`
 */

import { exit } from 'process';
import yargs from 'yargs/yargs';
import featureDefinitions from '../config/babel/features.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function modifyFeatureDefinitionsFile() {
  const { feature, option } = parseArgs(process.argv);

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

function parseArgs(argv) {
  const args = yargs(argv.slice(2))
    .usage('$0 [options]', 'Use this script to generate api.json files for beta features for uploading to apiview.dev for review.')
    .example([
      ['$0 --feature my-feature --option alphaToBeta', 'Mark feature as alpha from beta.']
    ])
    .options({
      feature: {
        alias: 'f',
        type: 'string',
        describe: 'Feature name to generate api files for. This should match the name in the features.js'
      },
      option: {
        alias: 'o',
        type: 'string',
        describe: 'The option to adjust the feature',
        choices: ['alphaToBeta', 'betaToAlpha', 'betaToStable', 'stableToBeta']
      }
    })
    .parseSync();

  if (!args.feature) {
    console.error('ERROR: Could not find feature name. Please provide a feature name using the `feature` argument.');
    exit(-1);
  }

  return args;
}

modifyFeatureDefinitionsFile();
