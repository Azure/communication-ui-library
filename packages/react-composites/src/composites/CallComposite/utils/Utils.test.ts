// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isInCall, reduceCallControlsForMobile } from './Utils';

describe('SDKUtils tests', () => {
  describe('isInCall tests', () => {
    test('isInCall should return true if state is anything other than none or disconnected', () => {
      // false conditions
      expect(isInCall('None')).toEqual(false);
      expect(isInCall('Disconnected')).toEqual(false);

      // true conditions
      expect(isInCall('Connecting')).toEqual(true);
      expect(isInCall('Ringing')).toEqual(true);
      expect(isInCall('Connected')).toEqual(true);
      expect(isInCall('LocalHold')).toEqual(true);
      expect(isInCall('RemoteHold')).toEqual(true);
      expect(isInCall('InLobby')).toEqual(true);
      expect(isInCall('Disconnecting')).toEqual(true);
      expect(isInCall('EarlyMedia')).toEqual(true);
    });
  });

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
