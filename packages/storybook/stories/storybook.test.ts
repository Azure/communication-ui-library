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

// Reset the stylesheet classname generator for the snapshot tests.
// Classnames are of the format css-#, where # is an integer that is
// incremented with each new classname generated. (css- is the default prefix
// but it can also use the display name of the component). For more information
// see: https://github.com/microsoft/fluentui/blob/master/packages/merge-styles/src/Stylesheet.ts#L171
// As class names are generated from the Stylesheet, which is a global singleton, any
// tests that have run before this test suite will have incremented the classname count.
// Here we reset the count to ensure classname generation begins at 0.
// Currently unsure if tests running in parallel will cause these snapshots to fail again, if that
// happens we should replace the classname generator with our own deterministic classname generator.
beforeEach(() => {
  Stylesheet.getInstance().reset();
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
