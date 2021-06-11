// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { CallState } from 'calling-stateful-client';
import { getCall } from 'calling-component-bindings';

export const lobbySelector = reselect.createSelector([getCall], (call: CallState | undefined) => {
  const localVideoStream = call?.localVideoStreams.find((i) => i.mediaStreamType === 'Video');
  return {
    localParticipantVideoStream: {
      isAvailable: !!localVideoStream,
      isMirrored: localVideoStream?.view?.isMirrored,
      renderElement: localVideoStream?.view?.target
    }
  };
});
