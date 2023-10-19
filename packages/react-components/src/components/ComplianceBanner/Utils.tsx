// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 */
export type ComplianceState = 'on' | 'off' | 'stopped';

/**
 * Return different conditions based on the current and previous state of recording and transcribing
 *
 * @param callRecordState - The current call record state: on, off, stopped
 * @param callTranscribeState - The current call transcribe state: on, off, stopped
 *
 * @remarks - The stopped state means: previously on but currently off
 *
 * @private
 */
export const computeVariant = (
  callRecordState: ComplianceState,
  callTranscribeState: ComplianceState
): ComplianceBannerVariant => {
  if (callRecordState === 'on' && callTranscribeState === 'on') {
    return 'RECORDING_AND_TRANSCRIPTION_STARTED';
  } else if (callRecordState === 'on' && callTranscribeState === 'off') {
    return 'RECORDING_STARTED';
  } else if (callRecordState === 'off' && callTranscribeState === 'on') {
    return 'TRANSCRIPTION_STARTED';
  } else if (callRecordState === 'on' && callTranscribeState === 'stopped') {
    return 'TRANSCRIPTION_STOPPED_STILL_RECORDING';
  } else if (callRecordState === 'stopped' && callTranscribeState === 'on') {
    return 'RECORDING_STOPPED_STILL_TRANSCRIBING';
  } else if (callRecordState === 'off' && callTranscribeState === 'stopped') {
    return 'TRANSCRIPTION_STOPPED';
  } else if (callRecordState === 'stopped' && callTranscribeState === 'off') {
    return 'RECORDING_STOPPED';
  } else if (callRecordState === 'stopped' && callTranscribeState === 'stopped') {
    return 'RECORDING_AND_TRANSCRIPTION_STOPPED';
  } else {
    return 'NO_STATE';
  }
};

/**
 * @private
 */
export type ComplianceBannerVariant =
  | 'NO_STATE'
  | 'TRANSCRIPTION_STOPPED_STILL_RECORDING'
  | 'RECORDING_STOPPED_STILL_TRANSCRIBING'
  | 'RECORDING_AND_TRANSCRIPTION_STOPPED'
  | 'RECORDING_AND_TRANSCRIPTION_STARTED'
  | 'TRANSCRIPTION_STARTED'
  | 'RECORDING_STOPPED'
  | 'RECORDING_STARTED'
  | 'TRANSCRIPTION_STOPPED';
