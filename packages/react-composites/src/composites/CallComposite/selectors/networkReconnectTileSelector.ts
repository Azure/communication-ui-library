// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';
import { lobbySelector } from './lobbySelector';

/**
 * @private
 */
export const networkReconnectTileSelector = reselect.createSelector(
  [getUserFacingDiagnostics, lobbySelector],
  (diagnostics, lobbyProps) => {
    return {
      networkReconnectValue: diagnostics?.network.latest.networkReconnect?.value,
      localParticipantVideoStream: lobbyProps.localParticipantVideoStream
    };
  }
);
