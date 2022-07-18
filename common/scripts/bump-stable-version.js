const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const bumpType = process.argv[2];

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  if (!['minor', 'patch'].includes(bumpType)) {
    throw '\nplease add either minor/patch as parameter!\n\n  Syntax:\n  node bump-stable-version.js minor\n'
  }
  updateAllVersions(bumpVersion);
}

const bumpVersion = (currentVersion) => {
  // Remove beta suffix if there is one
  const nonBetaVersion = removeBetaSuffix(currentVersion);
  const [major, minor, patch] = nonBetaVersion.split('.');
  const newMinor = bumpType === 'minor' ? Number.parseInt(minor) + 1 : minor;
  const newPatch = bumpType === 'minor' ?
    0
    : bumpType === 'patch' ? Number.parseInt(patch) + 1 : patch;

  return [major, newMinor, newPatch].join('.');
}

const removeBetaSuffix = (currentVersion) => {
  return currentVersion.split('-beta')[0];
}

main();