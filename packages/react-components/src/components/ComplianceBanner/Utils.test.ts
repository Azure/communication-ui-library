// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { computeVariant } from './Utils';

describe('Record and Transcription tests', () => {
  describe('computeVariant tests', () => {
    test('start recording and transcription state remains off, computeVariant should return RECORDING_STARTED', () => {
      expect(computeVariant('on', 'off')).toEqual('RECORDING_STARTED');
    });
    test('start transcribing but recording state remains off, computeVariant should return TRANSCRIPTION_STARTED', () => {
      expect(computeVariant('off', 'on')).toEqual('TRANSCRIPTION_STARTED');
    });
    test('stop recording and transcribing state remains off, computeVariant should return RECORDING_STOPPED', () => {
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
