"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT License.
// See the @microsoft/rush package's LICENSE file for license information.

// Use this script to set all the packlets' version to a specific value.
// Usually, packlet versions are managed by release automation, using the sibling scripts: bump-*-versions.js
// This script is a break-glass to be used for hotfix releases or when the version bump logic is insufficient.

const path = require('path');
const { updateAllVersions, findAllPackageJSON, getAllNames, updateAllDepVersions } = require('./package-utils');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

function main(args) {
    const version = args[2];
    if (!version) {
        throw new Error('Usage: node set-packlet-versions.js <version>');
    }
    const packagePaths = findAllPackageJSON(PACKAGES_DIR);
    const depNames = getAllNames(packagePaths);
    updateAllVersions(() => version);
    updateAllDepVersions(() => version, depNames);
}

main(process.argv)