// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';

/**
 * @private
 */
export const mutedNotificationSelector = reselect.createSelector([getUserFacingDiagnostics], (diagnostics) => {
  return {
    speakingWhileMuted: !!diagnostics?.media.latest.speakingWhileMicrophoneIsMuted?.value
  };
});
