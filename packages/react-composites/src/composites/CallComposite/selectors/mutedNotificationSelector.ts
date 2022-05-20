// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DiagnosticsCallFeatureState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function selectNetworkReconnectTile(diagnostics?: DiagnosticsCallFeatureState) {
  return {
    speakingWhileMuted: !!diagnostics?.media.latest.speakingWhileMicrophoneIsMuted?.value
  };
}

/**
 * @private
 */
export const mutedNotificationSelector = reselect.createSelector(
  [getUserFacingDiagnostics],
  selectNetworkReconnectTile
);
