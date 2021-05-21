// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getCall } from './baseSelectors';

export const complianceBannerSelector = reselect.createSelector([getCall], (call) => {
  return {
    callTranscribeState: call?.transcription.isTranscriptionActive,
    callRecordState: call?.recording.isRecordingActive
  };
});
