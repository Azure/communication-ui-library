// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getLocalVideoStreams } from './baseSelectors';

/**
 * @private
 */
export const mediaGallerySelector = reselect.createSelector([getLocalVideoStreams], (localVideoStreams) => {
  return {
    isVideoStreamOn: !!localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video')?.view?.target
  };
});
