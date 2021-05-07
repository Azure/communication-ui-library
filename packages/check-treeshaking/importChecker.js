// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const path = require('path');
const forbiddenDependencies = require('./forbiddenDependencies');

// thanks to https://github.com/webpack/webpack/issues/2090#issuecomment-302643018
function findEntry(mod) {
  if (mod.reasons.length > 0 && mod.reasons[0].module.resource) {
    return findEntry(mod.reasons[0].module);
  }
  return mod.resource;
}

function getCurrentEntry(context) {
  const absolutePath = findEntry(context._module);
  return path.relative(__dirname, absolutePath).replace(/\\/g, '/');
}

function importChecker(content) {
  const currentEntry = getCurrentEntry(this);
  const forbiddenImports = forbiddenDependencies[currentEntry];
  if (!forbiddenImports) return content;

  for (const line of content.split(/\n/)) {
    if (!line.startsWith('import ')) continue;
    for (const forbiddenImport of forbiddenImports) {
      if (line.indexOf(forbiddenImport) === -1) continue;
      throw new Error(`${this._module.rawRequest} has forbidden dependency on ${forbiddenImport}`);
    }
  }

  return content;
}

module.exports = importChecker;
