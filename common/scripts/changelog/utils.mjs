// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Returns the filename in group1 of the regex match
const CHANGE_FILE_REGEX = /(?:change|change-beta)\/(@azure-communication-react[^\/]*\.json)(?:.*)?$/;

export function parseNewChangeFiles(stdout) {
    // Split the output into lines and filter out the empty lines
    const stdoutLines = stdout.split('\n').filter(line => line && line.toString().trim().length > 0);

    // Parse the change file name from the output (remove the status and return only file information)
    const matches = stdoutLines.map(line => {
        const match = line.match(CHANGE_FILE_REGEX);
        return match ? match[1] : undefined // Access group 1 (the filename);
    }
    ).filter(Boolean); // Filter out nulls

    return matches;
}
