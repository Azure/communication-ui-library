// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import * as callingDeclarative from '@azure/acs-calling-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { getCall, getDeviceManager } from './baseSelectors';
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';

export const microphoneButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: !call?.isMuted
  };
});

export const videoButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: !!call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')
  };
});

export const screenShareButtonSelector = reselect.createSelector([getCall], (call) => {
  return {
    checked: call?.isScreenSharingOn
  };
});

export const optionsButtonSelector = reselect.createSelector([getDeviceManager, getCall], (deviceManager, call): {
  selectedMicrophone: AudioDeviceInfo | undefined;
  selectedSpeaker: AudioDeviceInfo | undefined;
  selectedCamera: VideoDeviceInfo | undefined;
} => {
  return {
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker,
    selectedCamera: call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video')?.source
  };
});
