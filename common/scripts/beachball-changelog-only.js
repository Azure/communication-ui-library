// This is a workaround for generating changelog without bumping
// The issue is that beachball doesn't expose changelog command as documented
// Will use the cli command when the issue gets resolved
// Issue: https://github.com/microsoft/beachball/issues/634

const { getPackageInfos } = require('../config/node_modules/beachball/lib/monorepo/getPackageInfos');
const { gatherBumpInfo } = require('../config/node_modules/beachball/lib/bump/gatherBumpInfo');
const { performBump } = require('../config/node_modules/beachball/lib/bump/performBump');
const { getOptions } = require("../config/node_modules/beachball/lib/options/getOptions");

const options = getOptions(process.argv);
const preservedPackages = {};

const packageInfos = getPackageInfos(options.path);

// Preserve(deep clone) the current packageInfo before bump, we don't change version number using beachball
for (const name in packageInfos) {
  preservedPackages[name] = JSON.parse(JSON.stringify(packageInfos[name]));
}
const bumpInfo = gatherBumpInfo(options, packageInfos);

// Restore packageInfo so no bump to versions by beachball
for (const name in bumpInfo.packageInfos) {
  bumpInfo.packageInfos[name] = preservedPackages[name];
}
performBump(bumpInfo, options);
