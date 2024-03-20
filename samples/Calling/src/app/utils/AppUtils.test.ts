// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createRandomDisplayName, getGroupIdFromUrl } from './AppUtils';

describe('ContosoUtils tests', () => {
  describe('getGroupIdFromUrl tests', () => {
    const originalTitle = window.document.title;
    const originalHref = window.location.href;

    afterEach(() => {
      window.history.pushState({}, originalTitle, originalHref);
    });

    test('getGroupIdFromUrl should return the group id from the url if it exists or null otherwise', () => {
      const expectedGroupId = 'group123';
      window.history.pushState({}, originalTitle, `${originalHref}?groupId=${expectedGroupId}`);
      expect(getGroupIdFromUrl()).toEqual(expectedGroupId);
    });

    test('getGroupIdFromUrl should return the group id from the url if it exists or null otherwise', () => {
      window.history.pushState({}, originalTitle, `${originalHref}`);
      expect(getGroupIdFromUrl()).toEqual(null);
    });
  });

  test('createRandomDisplayName should return a valid string for a user id', () =>
    expect(createRandomDisplayName()).toBeTruthy());
});
