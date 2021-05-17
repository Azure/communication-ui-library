// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import * as callingDeclarative from 'calling-stateful-client';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getCall, getDeviceManager } from './baseSelectors';

export const mediaGallerySelector = reselect.createSelector([getCall, getDeviceManager], (call, deviceManager) => {
  const previewOn = !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
  return {
    isCameraChecked: previewOn || !!call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video'),
    isVideoStreamOn: !!call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')
      ?.videoStreamRendererView?.target
  };
});
