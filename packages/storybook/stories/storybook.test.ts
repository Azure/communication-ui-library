// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stylesheet } from '@fluentui/react';
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

// Classnames in fluent are of the format css-#, where # is an integer that is incremented by a global singleton
// when each new classname is generated.
// Here we mock the classname generation for two reasons:
//   1. Unblocks parallel tests - if the order in which the tests run changes the generated css classnames
//      will differ across different runs
//   2. Prevents unnecessary PR friction - often PRs with small changes to styles would require snapshots to be updated
//      simply to change a couple of css-# numbered classes. This caused a lot of developer friction.
beforeEach(() => {
  Stylesheet.getInstance().getClassName = () => 'css-stub-classname';
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

describe('storybook snapshot tests', () => {
  initStoryshots({
    test: multiSnapshotWithOptions()
  });
});
