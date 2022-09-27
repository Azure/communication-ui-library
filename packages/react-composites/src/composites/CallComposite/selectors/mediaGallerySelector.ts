// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getLocalVideoStreams, getPinnedParticipants } from './baseSelectors';

/**
 * @private
 */
export const mediaGallerySelector = reselect.createSelector(
  [getLocalVideoStreams, getPinnedParticipants],
  (localVideoStreams, pinnedParticipants) => {
    return {
      isVideoStreamOn: !!localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video')?.view?.target,
      pinnedParticipants
    };
  }
);
