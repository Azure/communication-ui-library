// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';

/**
 * @private
 */
export const lobbySelector = reselect.createSelector([localVideoSelector], (localVideoStreamInfo) => {
  return {
    localParticipantVideoStream: localVideoStreamInfo
  };
});
