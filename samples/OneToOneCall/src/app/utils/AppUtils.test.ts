// © Microsoft Corporation. All rights reserved.

import { createRandomDisplayName } from './AppUtils';

describe('ContosoUtils tests', () => {
  test('createRandomDisplayName should return a valid string for a user id', () =>
    expect(createRandomDisplayName()).toBeTruthy());
});
