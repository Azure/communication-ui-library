// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DiagnosticsCallFeatureState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';
import { lobbySelector } from './lobbySelector';

function selectNetworkReconnectTile(
  diagnostics: DiagnosticsCallFeatureState | undefined,
  lobbyProps: ReturnType<typeof lobbySelector>
) {
  return {
    networkReconnectValue: diagnostics?.network.latest.networkReconnect?.value,
    localParticipantVideoStream: lobbyProps.localParticipantVideoStream
  };
}

/**
 * @private
 */
export const networkReconnectTileSelector = reselect.createSelector(
  [getUserFacingDiagnostics, lobbySelector],
  selectNetworkReconnectTile
);
