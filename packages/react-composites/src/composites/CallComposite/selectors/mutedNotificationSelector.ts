// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DiagnosticsCallFeatureState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';

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
