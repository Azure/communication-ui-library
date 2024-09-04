// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const NEW_CHANGE_FILE_REGEXP = /\s*change\/(.*\.json)\s*/;

export function parseNewChangeFiles(stdout) {
    const lines = stdout.split('\n');
    const matches = lines.map(line => line.match(NEW_CHANGE_FILE_REGEXP)).filter(match => !!match);
    // Extract the first capture group.
    return matches.map(match => match[1]);
}