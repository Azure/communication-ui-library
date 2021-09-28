// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getIsRecordingActive, getIsTranscriptionActive } from './baseSelectors';

/**
 * @private
 */
export const complianceBannerSelector = reselect.createSelector(
  [getIsTranscriptionActive, getIsRecordingActive],
  (isTranscriptionActive, isRecordingActive) => {
    return {
      callTranscribeState: isTranscriptionActive,
      callRecordState: isRecordingActive
    };
  }
);
