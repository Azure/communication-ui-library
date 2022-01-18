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
    test('start recording and transcription state remains off, computeVariant should return RECORDING_STARTED', () => {
      expect(computeVariant('on', 'off')).toEqual('RECORDING_STARTED');
    });
    test('start transcribing but recording state remains off, computeVariant should return TRANSCRIPTION_STARTED', () => {
      expect(computeVariant('off', 'on')).toEqual('TRANSCRIPTION_STARTED');
    });
    test('stop recording and transcribtion state remains off, computeVariant should return RECORDING_STOPPED', () => {
      expect(computeVariant('stopped', 'off')).toEqual('RECORDING_STOPPED');
    });
    test('stop transcribing and recording state remains off, computeVariant should return TRANSCRIPTION_STOPPED', () => {
      expect(computeVariant('off', 'stopped')).toEqual('TRANSCRIPTION_STOPPED');
    });
    test('stop both transcribing and recording, computeVariant should return RECORDING_AND_TRANSCRIPTION_STOPPED', () => {
      expect(computeVariant('stopped', 'stopped')).toEqual('RECORDING_AND_TRANSCRIPTION_STOPPED');
    });
    test('start both transcribing and recording, computeVariant should return RECORDING_AND_TRANSCRIPTION_STARTED', () => {
      expect(computeVariant('on', 'on')).toEqual('RECORDING_AND_TRANSCRIPTION_STARTED');
    });
    test('recording stopped and continue transcribing, computeVariant should return RECORDING_STOPPED_STILL_TRANSCRIBING', () => {
      expect(computeVariant('stopped', 'on')).toEqual('RECORDING_STOPPED_STILL_TRANSCRIBING');
    });
    test('transcribing stopped and continue recording, computeVariant should return TRANSCRIPTION_STOPPED_STILL_RECORDING', () => {
      expect(computeVariant('on', 'stopped')).toEqual('TRANSCRIPTION_STOPPED_STILL_RECORDING');
    });
  });
});
