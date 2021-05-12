// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// <reference path="../node_modules/@types/jest/index.d.ts" />

import { transformFileImports } from './transformImports';
import fs from 'fs';

const testPackageTransform = { 'test-pkg': 'transform-pkg' };

const tests = {
  importTestSingleLine: {
    input: `import { i } from 'test-pkg';`,
    expectedOutput: `import { i } from 'transform-pkg';`
  },
  importTestSingleLineDefaultImport: {
    input: `import i from 'test-pkg';`,
    expectedOutput: `import i from 'transform-pkg';`
  },
  importTestDoubleQuotes: {
    input: `import i from "test-pkg";`,
    expectedOutput: `import i from "transform-pkg";`
  },
  importTestNoSemiColon: {
    input: `import i from 'test-pkg'`,
    expectedOutput: `import i from 'transform-pkg'`
  },
  importTestCommentLine: {
    input: `// import { i } from 'test-pkg';`,
    expectedOutput: `// import { i } from 'transform-pkg';`
  },
  importTestMultiLine: {
    input: `import { i,
            j,
            k,
          } from 'test-pkg;`,
    expectedOutput: `import { i,
            j,
            k,
          } from 'transform-pkg;`
  },
  importTestNoop: {
    input: `import { noop } from 'valid-pkg';`,
    expectedOutput: ''
  }
};

const requireTest_input = `const i = require('test-pkg');`;
const requireTest_result = `const i = require('transform-pkg');`;

let result: string;
function setupTest(mockFileContents: string) {
  result = '';
  jest.spyOn(fs, 'readFileSync').mockImplementation(() => mockFileContents);
  jest.spyOn(fs, 'writeFileSync').mockImplementation((_, contents) => {
    result = contents as string;
  });
}

describe('File import transform tests', () => {
  test('transformFileImports rewrites import package correctly', () => {
    setupTest(tests.importTestSingleLine.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestSingleLine.expectedOutput);

    setupTest(tests.importTestSingleLineDefaultImport.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestSingleLineDefaultImport.expectedOutput);

    setupTest(tests.importTestDoubleQuotes.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestDoubleQuotes.expectedOutput);

    setupTest(tests.importTestSingleLineDefaultImport.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestSingleLineDefaultImport.expectedOutput);

    setupTest(tests.importTestCommentLine.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestCommentLine.expectedOutput);

    setupTest(tests.importTestNoop.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestNoop.expectedOutput);

    setupTest(tests.importTestMultiLine.input);
    transformFileImports('', testPackageTransform, 0, console);
    expect(result.trim()).toEqual(tests.importTestMultiLine.expectedOutput);
  });
});
