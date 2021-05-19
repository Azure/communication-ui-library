// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getCall } from './baseSelectors';

export const mediaGallerySelector = reselect.createSelector([getCall], (call) => {
  const renderStatus = call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')?.viewStatus;
  return {
    isVideoStreamNotRendered: renderStatus === 'NotRendered'
  };
});
