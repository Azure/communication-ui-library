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
        compressedMode: true,
        screenShareButton: false
      });

      // Test defaults returned when empty object is passed in
      expect(reduceCallControlsForMobile(undefined)).toEqual({
        compressedMode: true,
        screenShareButton: false
      });

      // Test defaults returned when empty object is passed in
      expect(reduceCallControlsForMobile({})).toEqual({
        compressedMode: true,
        screenShareButton: false
      });

      // Explicitly opted in for compressed mode false
      expect(reduceCallControlsForMobile({ compressedMode: false })).toEqual({
        compressedMode: false,
        screenShareButton: false
      });

      // Explicitly opted in for screenshare button true
      expect(reduceCallControlsForMobile({ screenShareButton: true })).toEqual({
        compressedMode: true,
        screenShareButton: true
      });
    });
  });
});
