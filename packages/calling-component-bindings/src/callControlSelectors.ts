// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CallClientState, DeviceManagerState, LocalVideoStreamState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  CallingBaseSelectorProps,
  getCallExists,
  getDeviceManager,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams
} from './baseSelectors';
import { _isPreviewOn } from './callUtils';

/**
 * Selector type for {@link MicrophoneButton} component.
 *
 * @public
 */
export type MicrophoneButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  disabled: boolean;
  checked: boolean;
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
};

/**
 * @private
 */
const selectMicrophoneButton = (
  callExists: boolean,
  isMuted: boolean | undefined,
  deviceManager: DeviceManagerState
): ReturnType<MicrophoneButtonSelector> => {
  const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;
  return {
    disabled: !callExists || !permission,
    checked: callExists ? !isMuted : false,
    microphones: deviceManager.microphones,
    speakers: deviceManager.speakers,
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker
  };
};

/**
 * Selector for {@link MicrophoneButton} component.
 *
 * @public
 */
export const microphoneButtonSelector: MicrophoneButtonSelector = reselect.createSelector(
  [getCallExists, getIsMuted, getDeviceManager],
  selectMicrophoneButton
);

/**
 * Selector type for {@link CameraButton} component.
 *
 * @public
 */
export type CameraButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  disabled: boolean;
  checked: boolean;
  cameras: VideoDeviceInfo[];
  selectedCamera?: VideoDeviceInfo;
};

/**
 * @private
 */
const selectCameraButton = (
  localVideoStreams: LocalVideoStreamState[] | undefined,
  deviceManager: DeviceManagerState
): ReturnType<CameraButtonSelector> => {
  const previewOn = _isPreviewOn(deviceManager);
  const localVideoFromCall = localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video');
  const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true;

  return {
    disabled: !deviceManager.selectedCamera || !permission,
    checked: localVideoStreams !== undefined && localVideoStreams.length > 0 ? !!localVideoFromCall : previewOn,
    cameras: deviceManager.cameras,
    selectedCamera: deviceManager.selectedCamera
  };
};

/**
 * Selector for {@link CameraButton} component.
 *
 * @public
 */
export const cameraButtonSelector: CameraButtonSelector = reselect.createSelector(
  [getLocalVideoStreams, getDeviceManager],
  selectCameraButton
);

/**
 * Selector type for {@link ScreenShareButton} component.
 *
 * @public
 */
export type ScreenShareButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked?: boolean;
};

/**
 * @private
 */
const selectScreenShareButton = (isScreenSharingOn?: boolean): ReturnType<ScreenShareButtonSelector> => {
  return {
    checked: isScreenSharingOn
  };
};

/**
 * Selector for {@link ScreenShareButton} component.
 *
 * @public
 */
export const screenShareButtonSelector: ScreenShareButtonSelector = reselect.createSelector(
  [getIsScreenSharingOn],
  selectScreenShareButton
);

/**
 * Selector type for {@link DevicesButton} component.
 *
 * @public
 */
export type DevicesButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  cameras: VideoDeviceInfo[];
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  selectedCamera?: VideoDeviceInfo;
};

/**
 * @private
 */
const selectDevicesButton = (deviceManager: DeviceManagerState): ReturnType<DevicesButtonSelector> => {
  return {
    microphones: deviceManager.microphones,
    speakers: deviceManager.speakers,
    cameras: deviceManager.cameras,
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker,
    selectedCamera: deviceManager.selectedCamera
  };
};

/**
 * Selector for {@link DevicesButton} component.
 *
 * @public
 */
export const devicesButtonSelector: DevicesButtonSelector = reselect.createSelector(
  [getDeviceManager],
  selectDevicesButton
);
