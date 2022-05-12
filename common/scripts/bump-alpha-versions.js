const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames, updateAllDepVersions } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

const date = process.argv[2];

const main = () => {
  const packagePaths = findAllPackageJSON(PACKAGES_DIR);
  const depNames = getAllNames(packagePaths);
  updateAllVersions(bumpAlphaVersion);
  // Need to update all internal project dependencies using the same rule
  updateAllDepVersions(bumpAlphaVersion, depNames);
}

const bumpAlphaVersion = (currentVersion) => {
  const versionStrs = currentVersion.split('-beta.');
  const [major, minor, patch] = versionStrs[0].split('.');
  const newPatch = versionStrs[1] ? patch : Number.parseInt(patch) + 1;

  // We will bump the patch version when create a alpha on top of the current stable or beta release.
  return [[major, minor, newPatch ].join('.'), `${date}`].join('-alpha-');
}

main();
