// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { Call, CallClientState, DeviceManagerState } from 'calling-stateful-client';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getCall, getDeviceManager } from './baseSelectors';
// @ts-ignore
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';

export const microphoneButtonSelector = reselect.createSelector([getCall, getDeviceManager], (call, deviceManager) => {
  return {
    disabled: !call,
    checked: call ? !call.isMuted : false
  };
});

export const cameraButtonSelector = reselect.createSelector([getCall, getDeviceManager], (call, deviceManager) => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  const previewOn = deviceManager.unparentedViews.values().next().value?.view !== undefined;
  const localVideoFromCall = call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');

  return {
    disabled: !deviceManager.selectedCamera,
    checked: call ? !!localVideoFromCall : previewOn
  };
});

export const screenShareButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: call?.isScreenSharingOn
  };
});

export const optionsButtonSelector = reselect.createSelector([getDeviceManager, getCall], (deviceManager) => {
  return {
    microphones: deviceManager.microphones,
    speakers: deviceManager.speakers,
    cameras: deviceManager.cameras,
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker,
    selectedCamera: deviceManager.selectedCamera
  };
});
