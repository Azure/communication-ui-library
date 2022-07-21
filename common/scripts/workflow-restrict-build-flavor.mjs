#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { REPO_ROOT } from './lib/index.mjs';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const MATRIX_JSON = path.join(REPO_ROOT, 'common', 'config', 'workflows', 'matrix.json');

function main(args) {
    const target = args[2]
    if (target !== 'stable' && target !== 'beta') {
        throw new Error(`Usage: ${args[1]} ['stable' | 'beta']\n`);
    }

    const text = readFileSync(MATRIX_JSON, 'utf8');
    const data = JSON.parse(text);
    data.include = data.include.filter((include) => include.flavor === target);
    writeFileSync(MATRIX_JSON, JSON.stringify(data, null, 2), 'utf8');
}

main(process.argv)