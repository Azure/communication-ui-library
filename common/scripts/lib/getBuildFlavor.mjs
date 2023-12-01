// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { readFileSync } from 'fs';
import { REPO_ROOT } from './constants.mjs';

const ENV_FILE = path.join(REPO_ROOT, 'common', 'config', 'env', '.env');
const ENV_PREFIX = 'COMMUNICATION_REACT_FLAVOR=';

/**
 * Get the current build flavor.
 *
 * Parses the relevant environment file and returns the build flavor as string.
 *
 * @return 'stable' | 'beta' | 'beta-release'
 */
export function getBuildFlavor() {
    const data = readFileSync(ENV_FILE, 'utf8');
    for (const line of data.split(/\r\n|\r|\n/)) {
        if (line.startsWith(ENV_PREFIX)) {
            return line.substring(ENV_PREFIX.length).trim()
        }
    }
    throw new Error(`Malformed build flavor: ${data}`);
}