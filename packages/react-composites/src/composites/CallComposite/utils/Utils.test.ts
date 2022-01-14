// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { computeVariant, reduceCallControlsForMobile } from './Utils';

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

describe('Record and Transcription tests', () => {
  describe('computeVariant tests', () => {
    test('computeVariant should return expected values', () => {
      // start recording but not transcribing, should return RECORDING_STARTED
      expect(computeVariant(false, false, true, false)).toEqual('RECORDING_STARTED');

      // start transcribing but not recording, should return TRANSCRIPTION_STARTED
      expect(computeVariant(false, false, false, true)).toEqual('TRANSCRIPTION_STARTED');

      // stop recording and transcribing remains turned off, should return RECORDING_STOPPED
      expect(computeVariant(true, false, false, false)).toEqual('RECORDING_STOPPED');

      // stop transcribing and recording remains turned off , should return TRANSCRIPTION_STOPPED
      expect(computeVariant(false, true, false, false)).toEqual('TRANSCRIPTION_STOPPED');

      // stop both transcribing and recording , should return  RECORDING_AND_TRANSCRIPTION_STOPPED
      expect(computeVariant(true, true, false, false)).toEqual('RECORDING_AND_TRANSCRIPTION_STOPPED');

      // start both transcribing and recording , should return RECORDING_AND_TRANSCRIPTION_STARTED
      expect(computeVariant(false, false, true, true)).toEqual('RECORDING_AND_TRANSCRIPTION_STARTED');

      // recording stopped and continue transcribing , should return RECORDING_STOPPED_STILL_TRANSCRIBING
      expect(computeVariant(true, true, false, true)).toEqual('RECORDING_STOPPED_STILL_TRANSCRIBING');

      // transcribing stopped and continue recording, should return TRANSCRIPTION_STOPPED_STILL_RECORDING
      expect(computeVariant(true, true, true, false)).toEqual('TRANSCRIPTION_STOPPED_STILL_RECORDING');

      // no change, should return NO_STATE
      expect(computeVariant(true, true, true, true)).toEqual('NO_STATE');
      expect(computeVariant(true, false, true, false)).toEqual('NO_STATE');
      expect(computeVariant(false, true, false, true)).toEqual('NO_STATE');
      expect(computeVariant(false, false, false, false)).toEqual('NO_STATE');
    });
  });
});
