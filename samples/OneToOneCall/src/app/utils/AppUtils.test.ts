//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createRandomDisplayName } from './AppUtils';

describe('ContosoUtils tests', () => {
  test('createRandomDisplayName should return a valid string for a user id', () =>
    expect(createRandomDisplayName()).toBeTruthy());
});
