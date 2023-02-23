#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  if (target !== 'stable' && target !== 'beta') {
      throw new Error(`Usage: ${args[1]} ['stable' | 'beta']\n`);
  }

  restrictBuildFlavorForWorkflows(target);
  removeBetaOnlyDependencies(target);
  chooseSdkDependencies(target);
}

function restrictBuildFlavorForWorkflows(target) {
  const text = readFileSync(MATRIX_JSON, 'utf8');
    const data = JSON.parse(text);
    data.include = data.include.filter((include) => include.flavor === target);
    writeFileSync(MATRIX_JSON, JSON.stringify(data, null, 2), 'utf8');
}

// Dependencies to choose the right version for beta and stable
const SDK_DEPS = ["@azure/communication-calling", "@azure/communication-chat"]
// Depencies that are beta only and should be removed from stable packages
const BETA_ONLY_DEPS = ["@azure/communication-calling-effects"]

function chooseSdkDependencies(target) {
  const action = target === 'stable' ? chooseStableVersion : chooseBetaVersion;
  updateAllDepVersions(action, SDK_DEPS);
}

const chooseStableVersion = (semver) => {
  const versions = semver.split('||').map(version => version.trim());
  if(versions.length === 1) {
    return semver;
  }
  for(const version of versions) {
    if(!version.includes('beta') && !version.includes('alpha')) return version;
  }
  throw 'can\'t find the right version for stable!';
}

const chooseBetaVersion = (semver) => {
  const versions = semver.split('||').map(version => version.trim());
  if(versions.length === 1) {
    return semver;
  }
  for(const version of versions) {
    if(version.includes('beta')) return version;
  }
  throw 'can\'t find the right version for beta!';
}

function removeBetaOnlyDependencies(target) {
  if (target === 'stable') {
    removeDepsFromAllPackages(BETA_ONLY_DEPS);
  }
}

main(process.argv);