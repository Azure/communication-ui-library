// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const NEW_CHANGE_FILE_REGEXP = /\s*(@azure-communication-react-.*\.json)\s*/;

export function parseNewChangeFiles(stdout) {
    const lines = stdout.split('\n');
    // Filter out the lines that are not changefiles
    const matches = lines.filter(line => line.startsWith('A'));
    console.log("1", matches.map(line => line.split('\t')[1]));
    console.log("2", matches.map(match => match[1]));

    return matches.map(line => line.split('\t')[1]);
}