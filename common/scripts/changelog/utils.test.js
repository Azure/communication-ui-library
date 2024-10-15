// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { parseNewChangeFiles } from './utils';

describe('parseNewChangeFiles', () => {
  const testFilename = '@azure-communication-react-3ba4c269-8d22-48da-b905-091fdbaf2f98.json';
  const testStrings = [
    `A	change-beta/${testFilename}`,
    `A       change/${testFilename}`,
    `randomfolder/change-beta/${testFilename}random text that should be ignored`,
    `\n\nchange/${testFilename}\s \n \t`
  ];

  test('parseNewChangeFiles should return the filenames without folder prefixes or other space characters', () => {
    for (const testString of testStrings) {
      expect(parseNewChangeFiles(testString)).toStrictEqual([testFilename]);
    }
  });

  test('parseNewChangeFiles should return the filenames when multiple files are seperated by newline characters', () => {
    const test = testStrings.join('\n');
    const expectedMatch = new Array(testStrings.length).fill(testFilename);

    expect(parseNewChangeFiles(test)).toStrictEqual(expectedMatch);
  });
});