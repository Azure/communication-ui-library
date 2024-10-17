// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { registerIconsForTests } from './src/components/utils/testUtils';

// Ensure console errors and warnings fail tests
beforeAll(() => {
  registerIconsForTests();
});
