// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getCall } from './baseSelectors';

export const mediaGallerySelector = reselect.createSelector([getCall], (call) => {
  return {
    isVideoStreamOn: !!call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')
      ?.videoStreamRendererView?.target
  };
});
