// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function selectLobby(localVideoStreamInfo: ReturnType<typeof localVideoSelector>) {
  return {
    localParticipantVideoStream: localVideoStreamInfo
  };
}

/**
 * @private
 */
export const lobbySelector = reselect.createSelector([localVideoSelector], selectLobby);
