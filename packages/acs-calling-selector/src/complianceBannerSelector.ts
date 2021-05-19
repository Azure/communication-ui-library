// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { CallClientState, Call } from 'calling-stateful-client';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getCall } from './baseSelectors';

export const complianceBannerSelector = reselect.createSelector([getCall], (call) => {
  return {
    callTranscribeState: call?.transcription.isTranscriptionActive,
    callRecordState: call?.recording.isRecordingActive
  };
});
