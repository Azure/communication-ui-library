// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getIsRecordingActive, getIsTranscriptionActive } from './baseSelectors';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function selectComplianceBanner(isTranscriptionActive: boolean, isRecordingActive: boolean) {
  return {
    callTranscribeState: isTranscriptionActive,
    callRecordState: isRecordingActive
  };
}

/**
 * @private
 */
export const complianceBannerSelector = reselect.createSelector(
  [getIsTranscriptionActive, getIsRecordingActive],
  selectComplianceBanner
);
