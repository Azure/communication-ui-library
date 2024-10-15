// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { parseNewChangeFiles } from './utils';

describe('parseNewChangeFiles', () => {
  const testFilename = '@azure-communication-react-3ba4c269-8d22-48da-b905-091fdbaf2f98.json';
  const testString1 = `A	change-beta/${testFilename}`;
  const testString2 = `A       change/${testFilename}`;
  const testString3 = `randomfolder/change-beta/${testFilename}random text that should be ignored`;
  const testString4 = `\n\nchange/${testFilename}\s \n \t`;

  test('parseNewChangeFiles should return the filenames without folder prefixes or other space characters', () => {
    const testStrings = [testString1, testString2, testString3, testString4];

    for (const testString of testStrings) {
      expect(parseNewChangeFiles(testString)).toStrictEqual([testFilename]);
    }
  });

  test('parseNewChangeFiles should return the filenames when multiple files are seperated by newline characters', () => {
    const testStrings = [testString1, testString2, testString3, testString4].join('\n');
    const expectedMatch = [testFilename, testFilename, testFilename, testFilename];

    expect(parseNewChangeFiles(testStrings)).toStrictEqual(expectedMatch);
  });
});