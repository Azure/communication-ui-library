#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { REPO_ROOT } from './lib/index.mjs';
import { readFileSync } from 'fs';
import path from 'path';

const MATRIX_JSON = path.join(REPO_ROOT, 'common', 'config', 'workflows', 'matrix.json');

const text = readFileSync(MATRIX_JSON, 'utf8');
const denseText = JSON.stringify(JSON.parse(text), null, 0);
console.log(denseText);
