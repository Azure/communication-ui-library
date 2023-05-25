// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import path from 'path';
import { resetIds, Stylesheet } from '@fluentui/react';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import ReactDom from 'react-dom';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    })
  };
});

ReactDom.createPortal = (node: any) => node;

// Classnames in fluent are of the format <classname-prefix>-# (e.g. css-42), where # is an integer that is incremented by a
// global singleton when each new classname is generated.
// Here we mock the classname generation for two reasons:
//   1. Unblocks parallel tests - if the order in which the tests run changes the generated css classnames
//      will differ across different runs
//   2. Prevents unnecessary PR friction - often PRs with small changes to styles would require snapshots to be updated
//      simply to change the number of a couple of <classname-prefix>-# numbered classes. This caused a lot of developer friction.
Stylesheet.getInstance().getClassName = () => 'stub-classname';
beforeEach(() => {
  // Ideally we could stub out the getId in the same way we can stub out getClassName, but currently this is not
  // possible: https://github.com/microsoft/fluentui/blob/master/packages/utilities/src/getId.ts#L5
  resetIds(0);
});

// Storyshots do not fail on warnings or errors thrown by components, this is a quick fix to ensure we have tests fail when warning are outputted.
// Ideally this is something that should be supported by storybook. Related github discussion:
// https://github.com/storybookjs/storybook/discussions/13420
// NOTE: this does not work for warnings. Overriding console.warn is not picking up the logged warnings.
const consoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    consoleError(...args);
    throw 'Error found';
  };
});
afterAll(() => {
  console.error = consoleError;
});

describe.skip('storybook snapshot tests', () => {
  initStoryshots({
    test: (story) => {
      const fileName = path.resolve(__dirname, '..', story.context.fileName);
      return multiSnapshotWithOptions()({
        ...story,
        // Workaround for multiSnapshotWithOptions placing snapshots in a directory
        // one level too high. See more info and workaround snippet: https://github.com/storybookjs/storybook/issues/16692
        context: { ...story.context, fileName }
      });
    }
  });
  // The test below is required to avoid an intermittent error when generating new storybook pages
  // Particularly, npx jest outputs error "Your test suite must contain at least one test."
  test('fake test to prevent "no tests found error"', () => {
    expect(true).toBeTruthy();
  });
});
