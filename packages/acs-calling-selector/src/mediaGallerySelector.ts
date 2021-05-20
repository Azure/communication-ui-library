// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
// @ts-ignore
import { CallClientState, Call } from 'calling-stateful-client';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getCall } from './baseSelectors';

export const mediaGallerySelector = reselect.createSelector([getCall], (call) => {
  return {
    isVideoStreamOn: !!call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')?.view?.target
  };
});
