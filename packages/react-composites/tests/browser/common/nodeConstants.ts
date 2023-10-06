// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import dotenv from 'dotenv';
import path from 'path';

const ENV_FILE = path.join(__dirname, '..', '.env');
dotenv.config({ path: ENV_FILE });

if (!process.env.CONNECTION_STRING) {
  throw new Error(`No CONNECTION_STRING set in ${ENV_FILE}`);
}

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING;
