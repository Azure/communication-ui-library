// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
// @ts-ignore
import { CallState, CallClientState, LocalVideoStream } from 'calling-stateful-client';
// @ts-ignore
import { getCall, CallingBaseSelectorProps } from 'calling-component-bindings';

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
