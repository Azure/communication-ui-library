// This is a workaround for generating changelog without bumping
// The issue is that beachball doesn't expose changelog command as documented
// Will use the cli command when the issue gets resolved
// Issue: https://github.com/microsoft/beachball/issues/634

const { getPackageInfos } = require('../config/node_modules/beachball/lib/monorepo/getPackageInfos');
const { gatherBumpInfo } = require('../config/node_modules/beachball/lib/bump/gatherBumpInfo');
const { performBump } = require('../config/node_modules/beachball/lib/bump/performBump');
const { getOptions } = require("../config/node_modules/beachball/lib/options/getOptions");

const options = getOptions(process.argv);
const preservedVersions = {};

const packageInfos = getPackageInfos(options.path);

// Preserve the current version number before bump
for (const name in packageInfos) {
  preservedVersions[name] = packageInfos[name].version;
}
const bumpInfo = gatherBumpInfo(options, packageInfos);

// Recover the version number so no bump to versions by beachball
for (const name in bumpInfo.packageInfos) {
  bumpInfo.packageInfos[name].version = preservedVersions[name];
}
performBump(bumpInfo, options);
