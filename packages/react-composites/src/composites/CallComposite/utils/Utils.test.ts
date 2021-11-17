// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { reduceCallControlsForMobile } from './Utils';

describe('SDKUtils tests', () => {
  describe('reduceCallControlsForMobile tests', () => {
    test('reduceCallControlsForMobile should return expected values', () => {
      // False should return if control bar is set to hidden
      expect(reduceCallControlsForMobile(false)).toEqual(false);

      // Test defaults returned when empty object is passed in
      expect(reduceCallControlsForMobile(true)).toEqual({
        displayType: 'compact',
        screenShareButton: false
      });

      // Test defaults returned when empty object is passed in
      expect(reduceCallControlsForMobile(undefined)).toEqual({
        displayType: 'compact',
        screenShareButton: false
      });

      // Test defaults returned when empty object is passed in
      expect(reduceCallControlsForMobile({})).toEqual({
        displayType: 'compact',
        screenShareButton: false
      });

      // Explicitly opted in for screenshare button true
      expect(reduceCallControlsForMobile({ screenShareButton: true })).toEqual({
        displayType: 'compact',
        screenShareButton: true
      });
    });
  });
});
