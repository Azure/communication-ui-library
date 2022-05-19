// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';

const selectLobby = (localVideoStreamInfo: ReturnType<typeof localVideoSelector>) => {
  return {
    localParticipantVideoStream: localVideoStreamInfo
  };
};

/**
 * @private
 */
export const lobbySelector = reselect.createSelector([localVideoSelector], selectLobby);
