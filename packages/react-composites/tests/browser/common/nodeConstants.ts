// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.CONNECTION_STRING) {
  throw new Error('No CONNECTION_STRING set in environment variable.');
}

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING;
