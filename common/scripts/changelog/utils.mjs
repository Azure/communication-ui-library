// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export function parseNewChangeFiles(stdout) {
    const lines = stdout.split('\n');
    // Filter out the empty lines (`lines` might have empty lines as part of the output)
    const matches = lines.filter(line => line && line.toString().trim().length > 0);
    // Parse the change file name from the output (remove the status and return only file information)
    return matches.map(line => line.split('\t')[1]);
}