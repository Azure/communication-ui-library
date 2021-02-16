// © Microsoft Corporation. All rights reserved.

import { Stylesheet } from '@fluentui/react';
import initStoryshots from '@storybook/addon-storyshots';

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

describe('storybook snapshot tests', () => {
  initStoryshots();
});
