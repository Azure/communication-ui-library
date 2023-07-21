// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CallClientState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  CallingBaseSelectorProps,
  getCallExists,
  getDeviceManager,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams,
  getRole
} from './baseSelectors';
/* @conditional-compile-remove(PSTN-calls) */
import { getCallState } from './baseSelectors';
import { _isPreviewOn } from './utils/callUtils';

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
 * Selector for {@link MicrophoneButton} component.
 *
 * @public
 */
export const microphoneButtonSelector: MicrophoneButtonSelector = reselect.createSelector(
  [getCallExists, getIsMuted, getDeviceManager, getRole],
  (callExists, isMuted, deviceManager, role) => {
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;
    return {
      disabled: !callExists || !permission || role === 'Consumer',
      checked: callExists ? !isMuted : false,
      microphones: deviceManager.microphones,
      speakers: deviceManager.speakers,
      selectedMicrophone: deviceManager.selectedMicrophone,
      selectedSpeaker: deviceManager.selectedSpeaker
    };
  }
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
 * Selector for {@link CameraButton} component.
 *
 * @public
 */
export const cameraButtonSelector: CameraButtonSelector = reselect.createSelector(
  [getLocalVideoStreams, getDeviceManager, getRole],
  (localVideoStreams, deviceManager, role) => {
    const previewOn = _isPreviewOn(deviceManager);
    const localVideoFromCall = localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video');
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true;

    return {
      disabled: !deviceManager.selectedCamera || !permission || !deviceManager.cameras.length || role === 'Consumer',
      checked: localVideoStreams !== undefined && localVideoStreams.length > 0 ? !!localVideoFromCall : previewOn,
      cameras: deviceManager.cameras,
      selectedCamera: deviceManager.selectedCamera
    };
  }
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
  /* @conditional-compile-remove(PSTN-calls) */
  disabled?: boolean;
};

/**
 * Selector for {@link ScreenShareButton} component.
 *
 * @public
 */
export const screenShareButtonSelector: ScreenShareButtonSelector = reselect.createSelector(
  [getIsScreenSharingOn, /* @conditional-compile-remove(PSTN-calls) */ getCallState, getRole],
  (isScreenSharingOn, /* @conditional-compile-remove(PSTN-calls) */ callState, role) => {
    return {
      checked: isScreenSharingOn,
      /* @conditional-compile-remove(PSTN-calls) */
      disabled:
        (callState === 'InLobby' ? true : callState === 'Connecting' ?? false) ||
        role === 'Consumer' ||
        role === 'Attendee'
    };
  }
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
 * Selector for {@link DevicesButton} component.
 *
 * @public
 */
export const devicesButtonSelector: DevicesButtonSelector = reselect.createSelector(
  [getDeviceManager],
  (deviceManager) => {
    return {
      microphones: removeBlankNameDevices(deviceManager.microphones),
      speakers: removeBlankNameDevices(deviceManager.speakers),
      cameras: removeBlankNameDevices(deviceManager.cameras),
      selectedMicrophone: deviceManager.selectedMicrophone,
      selectedSpeaker: deviceManager.selectedSpeaker,
      selectedCamera: deviceManager.selectedCamera
    };
  }
);

function removeBlankNameDevices<T extends { name: string }>(devices: T[]): T[] {
  return devices.filter((device) => device.name !== '');
}

/* @conditional-compile-remove(PSTN-calls) */
/**
 * Selector type for the {@link HoldButton} component.
 * @public
 */
export type HoldButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked: boolean;
};

/* @conditional-compile-remove(PSTN-calls) */
/**
 * Selector for the {@link HoldButton} component.
 * @public
 */
export const holdButtonSelector: HoldButtonSelector = reselect.createSelector([getCallState], (callState) => {
  return {
    checked: callState === 'LocalHold'
  };
});
