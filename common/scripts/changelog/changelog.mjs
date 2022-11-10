// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Workaround for generating changelog without bumping versions.
 * Beachball doesn't expose changelog command currently.
 * Upstream feature request: https://github.com/microsoft/beachball/issues/650
 */

import { getPackageInfos } from '../../config/node_modules/beachball/lib/monorepo/getPackageInfos.js';
import {gatherBumpInfo} from '../../config/node_modules/beachball/lib/bump/gatherBumpInfo.js';
import {performBump} from '../../config/node_modules/beachball/lib/bump/performBump.js';
import { getOptions } from '../../config/node_modules/beachball/lib/options/getOptions.js';
import { CHANGE_DIR } from './constants.mjs';

import fs from 'fs';

export async function generateChangelogs() {
  const options = getOptions([]);
  const packageInfos = getPackageInfos(options.path);
  // Preserve(deep clone) the current packageInfo before bump, we don't change version number using beachball
  const preservedPackages = Object.fromEntries(Object.entries(packageInfos).map(([name, info]) => ([name, clone(info)])));
  const bumpInfo = gatherBumpInfo(options, packageInfos);

  // Restore packageInfo so no bump to versions by beachball
  for (const name in bumpInfo.packageInfos) {
    bumpInfo.packageInfos[name] = preservedPackages[name];
  }
  await performBump(bumpInfo, options);

  // Beachball deletes the change file directory which causes confusion for scripts
  // that manipulate working directory paths.
  ensureDirectory(CHANGE_DIR);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function ensureDirectory(dir) {
  if (!fs.statSync(dir, {throwIfNoEntry: false})) {
      fs.mkdirSync(dir);
  }
}