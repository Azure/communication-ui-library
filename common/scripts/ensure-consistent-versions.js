// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

"use strict";

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

function findAllPackageJSON(root){
    return fs.readdirSync(root).map(
        (pkg) => {
            const packageJSON = path.join(root, pkg, 'package.json');
            const stat = fs.lstatSync(packageJSON);
            if (!stat.isFile()) {
                throw new Error(packageJSON + ' does not exist!');
            }
            return packageJSON;
        }
    )
}

function readPackageVersion(packageJSON) {
    const parsed = JSON.parse(fs.readFileSync(packageJSON));
    const version = parsed['version'];
    if (!version) {
        throw new Error('Malformed version in ' + packageJSON);
    }
    return version;
}

function areVersionsIdentical(versions) {
    const goldenVersion = versions[0];
    return versions.every((ver) => ver === goldenVersion);
}

function ensurePackageVersionsAreIdentical(packages, versions) {
    if (!areVersionsIdentical(versions)) {
        console.log('Discovered package versions:');
        for (let i = 0; i < packages.length; i++) {
            console.log(packages[i], ': ', versions[i]);
        }
        throw new Error('found mismatched versions!');
    }
}

function main() {
    const packages = findAllPackageJSON(PACKAGES_DIR);
    const versions = packages.map((pkg) => readPackageVersion(pkg));

    if (versions.length === 0) {
        throw new Error('Failed to find any packages');
    }
    ensurePackageVersionsAreIdentical(packages, versions);
    console.log('All good!')
}

main()