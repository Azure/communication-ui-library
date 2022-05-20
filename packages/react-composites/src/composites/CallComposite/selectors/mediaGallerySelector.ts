// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStreamState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getLocalVideoStreams } from './baseSelectors';

function selectMediaGallery(localVideoStreams?: LocalVideoStreamState[]) {
  return {
    isVideoStreamOn: !!localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video')?.view?.target
  };
}

/**
 * @private
 */
export const mediaGallerySelector = reselect.createSelector([getLocalVideoStreams], selectMediaGallery);
