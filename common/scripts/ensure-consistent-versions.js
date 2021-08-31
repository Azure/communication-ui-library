// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', '..', 'packages');

function _findAllPackageJSON(root){
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

function _readPackageVersion(packageJSON) {
    const parsed = JSON.parse(fs.readFileSync(packageJSON));
    const version = parsed['version'];
    if (!version) {
        throw new Error('Malformed version in ' + packageJSON);
    }
    return version;
}

function _areVersionsIdentical(versions) {
    if (versions.length === 0) {
        return true;
    }
    const goldenVersion = versions[0];
    return versions.every((ver) => ver === goldenVersion);
}

function _main(){
    const _packages = _findAllPackageJSON(PACKAGES_DIR);
    const _versions = _packages.map((pkg) => _readPackageVersion(pkg));

    if (!_areVersionsIdentical(_versions)) {
        console.log('Discovered package versions:');
        for (let i = 0; i < _packages.length; i++) {
            console.log(_packages[i], ': ', _versions[i]);
        }
        throw new Error('Error: found mismatched versions!');
    }
    console.log('All good!')
}

_main()