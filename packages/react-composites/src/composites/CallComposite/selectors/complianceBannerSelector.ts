// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getIsRecordingActive, getIsTranscriptionActive } from './baseSelectors';

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
