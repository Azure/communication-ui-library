// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createKey, parseKey } from './RichTextTableUtils';

describe('RichTextTableUtils tests', () => {
  test('table key should be created and parsed', async () => {
    const column = 2;
    const row = 3;

    const key = createKey(row, column);
    const parsedKey = parseKey(key);
    expect(parsedKey).toEqual({ row, column });
  });
});
