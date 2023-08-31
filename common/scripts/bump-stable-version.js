const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames, updateAllDepVersions } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const bumpType = process.argv[2];

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  if (!['major', 'minor', 'patch', 'remove-beta'].includes(bumpType)) {
    throw '\nplease add either major/minor/patch/remove-beta as parameter!\n\n  Syntax:\n  node bump-stable-version.js minor\n'
  }
  updateAllVersions(bumpVersion);
  // Need to update all internal project dependencies using the same rule
  updateAllDepVersions(bumpVersion, depNames);
}

const bumpVersion = (currentVersion) => {
  // Remove beta suffix if there is one
  const nonBetaVersion = removeBetaSuffix(currentVersion);
  if (bumpType === 'remove-beta') {
    // Return the current version without the beta suffix
    return nonBetaVersion;
  } else {
    const [major, minor, patch] = nonBetaVersion.split('.');
    const newMajor = bumpType === 'major' ? Number.parseInt(major) + 1 : major;
    const newMinor = bumpType === 'major' ?
      0
      : bumpType === 'minor' ? Number.parseInt(minor) + 1 : minor;
    const newPatch = bumpType === 'major' || bumpType === 'minor' ?
      0
      : bumpType === 'patch' ? Number.parseInt(patch) + 1 : patch;

    return [newMajor, newMinor, newPatch].join('.');
  }
}

const removeBetaSuffix = (currentVersion) => {
  return currentVersion.split('-beta')[0];
}

main();