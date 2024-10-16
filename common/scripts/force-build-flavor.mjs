#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { REPO_ROOT } from './lib/index.mjs';
import { removeDepsFromAllPackages, updateAllDepVersions } from './package-utils.js';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const MATRIX_JSON = path.join(REPO_ROOT, 'common', 'config', 'workflows', 'matrix.json');

/**
 * This script forces the build target and dependencies to be restricted to the provided flavor.
 *
 * The script is used by release automation -- release branches only build a specific build flavor
 * based on the type of the release.
 *
 * See also `common/scripts/workflow-read-matrix.mjs`.
 */
function main(args) {
  const target = args[2]
  if (target !== 'stable' && target !== 'beta' && target !== 'beta-release') {
    throw new Error(`Usage: ${args[1]} ['stable' | 'beta' | 'beta-release']\n`);
  }

  restrictBuildFlavorForWorkflows(target);
  removeBetaOnlyDependencies(target);
  chooseSdkDependencies(target);
}

function restrictBuildFlavorForWorkflows(target) {
  const flavorJson = {
    "include": [
      {
        "flavor": target
      }
    ]
  }
  writeFileSync(MATRIX_JSON, JSON.stringify(flavorJson, null, 2), 'utf8');
}

// Dependencies to choose the right version for beta and stable
const SDK_DEPS = ["@azure/communication-calling", "@azure/communication-common", "@azure/communication-chat", "@azure/communication-calling-effects"]
// Depencies that are beta only and should be removed from stable packages
const BETA_ONLY_DEPS = []

function chooseSdkDependencies(target) {
  const action = target === 'stable' ? chooseStableVersion : chooseBetaVersion;
  updateAllDepVersions(action, SDK_DEPS);
}

const chooseStableVersion = (semver) => {
  const versions = semver.split('||').map(version => version.trim());
  if (versions.length === 1) {
    return semver;
  }
  for (const version of versions) {
    if (!version.includes('beta') && !version.includes('alpha')) return version;
  }
  throw 'can\'t find the right version for stable!';
}

const chooseBetaVersion = (semver) => {
  const versions = semver.split('||').map(version => version.trim());
  if (versions.length === 1) {
    return semver;
  }
  for (const version of versions) {
    if (version.includes('beta')) return version;
  }
  throw 'can\'t find the right version for beta!';
}

function removeBetaOnlyDependencies(target) {
  if (target === 'stable') {
    removeDepsFromAllPackages(BETA_ONLY_DEPS);
  }
}

main(process.argv);