// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import * as callingDeclarative from '@azure/acs-calling-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { getCall, getDeviceManager } from './baseSelectors';
// @ts-ignore
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';

export const microphoneButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: !call?.isMuted
  };
});

export const cameraButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: !!call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')
  };
});

export const screenShareButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: call?.isScreenSharingOn
  };
});

export const optionsButtonSelector = reselect.createSelector([getDeviceManager, getCall], (deviceManager, call) => {
  return {
    microphones: deviceManager.microphones,
    speakers: deviceManager.speakers,
    cameras: deviceManager.cameras,
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker,
    selectedCamera: call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')?.source
  };
});
