// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { registerIconsForTests } from './src/components/utils/testUtils';

// Ensure icons are registered for tests to prevent console warnings
beforeAll(() => {
  registerIconsForTests();
});
