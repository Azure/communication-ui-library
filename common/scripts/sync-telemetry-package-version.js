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
const GENERATED_FILE = path.join(ACS_UI_COMMMON, 'src', 'telemetryVersion.ts')
const BEACHBALL = path.join(ROOT, 'common', 'config', 'node_modules', 'beachball', 'bin', 'beachball');

function _readPackageVersion(packageJSON) {
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
        'export const telemetryVersion = \''+ packageVersion +'\';\n'
    )
}

function _telemetryVersionUpdated(filePath) {
    const diff = execSync('git diff -- ' + filePath).toString();
    return diff !== '';
    if (diff === '') {
        return false;
    }
}

function _main() {
    const version = _readPackageVersion(PACKAGE_JSON);
    _generateTelemetryVersionFile(GENERATED_FILE, version);
    if (_telemetryVersionUpdated(GENERATED_FILE)) {
        console.log('Wrote version ' + version + ' to ' + GENERATED_FILE);
    } else {
        console.log('Telemetry package version is already up to date.')
    }
}

_main();