// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getLocalVideoStreams } from './baseSelectors';

export const lobbySelector = reselect.createSelector([getLocalVideoStreams], (localVideoStreams) => {
  const localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
  return {
    localParticipantVideoStream: {
      isAvailable: !!localVideoStream,
      isMirrored: localVideoStream?.view?.isMirrored,
      renderElement: localVideoStream?.view?.target
    }
  };
});
