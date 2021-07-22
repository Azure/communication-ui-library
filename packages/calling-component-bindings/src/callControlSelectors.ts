// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import {
  getCallExists,
  getDeviceManager,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams
} from './baseSelectors';

export const microphoneButtonSelector = reselect.createSelector(
  [getCallExists, getIsMuted, getDeviceManager],
  (callExists, isMuted, deviceManager) => {
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;
    return {
      disabled: !callExists || !permission,
      checked: callExists ? !isMuted : false
    };
  }
);

export const cameraButtonSelector = reselect.createSelector(
  [getLocalVideoStreams, getDeviceManager],
  (localVideoStreams, deviceManager) => {
    // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
    // handle cases where 'Preview' view is in progress and not necessary completed.
    const previewOn = deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
    const localVideoFromCall = localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video');
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true;

    return {
      disabled: !deviceManager.selectedCamera || !permission,
      checked: localVideoStreams !== undefined ? !!localVideoFromCall : previewOn
    };
  }
);

export const screenShareButtonSelector = reselect.createSelector([getIsScreenSharingOn], (isScreenSharingOn) => {
  return {
    checked: isScreenSharingOn
  };
});

export const optionsButtonSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    microphones: deviceManager.microphones,
    speakers: deviceManager.speakers,
    cameras: deviceManager.cameras,
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker,
    selectedCamera: deviceManager.selectedCamera
  };
});
