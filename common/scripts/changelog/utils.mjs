// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export function parseNewChangeFiles(stdout) {
    const lines = stdout.split('\n');
    // Filter out the lines that are not changefiles
    const matches = lines.filter(line => line.startsWith('A'));
    // Parse the changefile name from the output
    return matches.map(line => line.split('\t')[1]);
}