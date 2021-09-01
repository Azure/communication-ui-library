// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..')
const PACKAGES_DIR = path.join(ROOT, 'packages');
const ACS_UI_COMMMON = path.join(PACKAGES_DIR, 'acs-ui-common');
const PACKAGE_JSON = path.join(ACS_UI_COMMMON, 'package.json');
const GENERATED_FILE = path.join(ACS_UI_COMMMON, 'src', 'telemetryVersion.js')
const BEACHBALL = path.join(ROOT, 'common', 'config', 'node_modules', 'beachball', 'bin', 'beachball');

function readPackageVersion(packageJSON) {
    const parsed = JSON.parse(fs.readFileSync(packageJSON));
    const version = parsed['version'];
    if (!version) {
        throw new Error('Malformed version in ' + packageJSON);
    }
    return version;
}

function _generateTelemetryVersionFile(filePath, packageVersion) {
    fs.writeFileSync(
        filePath,
        '// Copyright (c) Microsoft Corporation.\n' +
        '// Licensed under the MIT license.\n' +
        '\n' +
        '// GENERATED FILE. DO NOT EDIT MANUALLY.\n' +
        '\n' +
        'module.exports = \''+ packageVersion +'\';\n'
    )
}

function main() {
    const version = readPackageVersion(PACKAGE_JSON);
    _generateTelemetryVersionFile(GENERATED_FILE, version);
    console.log('Wrote version ' + version + ' to ' + GENERATED_FILE);
}

main();