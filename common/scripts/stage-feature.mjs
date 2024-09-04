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

  if (option === 'alphaToBeta' && !featureDefinitions.alpha.includes(feature)) {
    console.error(`ERROR: Feature "${feature}" is not in the alpha category.`);
    exit(-1);
  }
  if ((option === 'betaToAlpha' || option === 'betaToStable') && !featureDefinitions.beta.includes(feature)) {
    console.error(`ERROR: Feature "${feature}" is not in the beta category.`);
    exit(-1);
  }
  if (option === 'stableToBeta' && !featureDefinitions.stable.includes(feature)) {
    console.error(`ERROR: Feature "${feature}" is not in the stable category.`);
    exit(-1);
  }

  const newFeatureDefinitions =
    option === 'alphaToBeta' ? adjustFeatureDefinition(featureDefinitions, feature, 'alpha', 'beta') :
      option === 'betaToAlpha' ? adjustFeatureDefinition(featureDefinitions, feature, 'beta', 'alpha') :
        option === 'betaToStable' ? adjustFeatureDefinition(featureDefinitions, feature, 'beta', 'stable') :
          option === 'stableToBeta' ? adjustFeatureDefinition(featureDefinitions, feature, 'stable', 'beta') :
            (() => { throw new Error('Unhandled option') })();

  const featureDefinitionsFile = path.join(__dirname, '../config/babel/features.js');
  fs.writeFileSync(featureDefinitionsFile, `module.exports = ${JSON.stringify(newFeatureDefinitions, null, 2)};`);
}
/**
 * Adjust the feature definition based on the feature, removeFrom, and addTo parameters.
 * @param {object} feaureDefinition The feature definition object
 * @param {string} feature The feature to adjust
 * @param {string} removeFrom The category in the feature file to have the feature removed from
 * @param {string} addTo The category in the feature file to have the feature added to
*/
function adjustFeatureDefinition(feaureDefinition, feature, removeFrom, addTo) {
  const mutatedFeatureDefinitions = { ...feaureDefinition };
  mutatedFeatureDefinitions[removeFrom] = mutatedFeatureDefinitions[removeFrom].filter((f) => f !== feature);
  mutatedFeatureDefinitions[addTo].push(feature);
  return mutatedFeatureDefinitions;
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

  if (args.option !== 'alphaToBeta' && args.option !== 'betaToAlpha' && args.option !== 'betaToStable' && args.option !== 'stableToBeta') {
    console.error(`ERROR: Invalid option "${args.option}" provided to stage-feature.mjs`);
    exit(-1);
  }

  return args;
}

modifyFeatureDefinitionsFile();
