// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CallClientState, MediaClientState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  CallingBaseSelectorProps,
  getCallExists,
  getDeviceManager,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams
} from './baseSelectors';
import { getLocalParticipantReactionState } from './baseSelectors';

import { getCapabilities, getRole } from './baseSelectors';
import { getCallState } from './baseSelectors';
import { _isPreviewOn } from './utils/callUtils';
import { getLocalParticipantRaisedHand } from './baseSelectors';
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
  [getCallExists, getIsMuted, getDeviceManager, getCapabilities, getRole, getCallState],
  (callExists, isMuted, deviceManager, capabilities, role, callState) => {
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;

    const incapable =
      (capabilities?.unmuteMic.isPresent === false && capabilities?.unmuteMic.reason !== 'NotInitialized') ||
      role === 'Consumer';
    return {
      disabled: !callExists || !permission || incapable || callState === 'LocalHold',
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
  [getLocalVideoStreams, getDeviceManager, getCapabilities, getRole, getCallState],
  (localVideoStreams, deviceManager, capabilities, role, callState) => {
    const previewOn = _isPreviewOn(deviceManager);
    const localVideoFromCall = localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video');
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true;

    const incapable =
      (capabilities?.turnVideoOn.isPresent === false && capabilities?.turnVideoOn.reason !== 'NotInitialized') ||
      role === 'Consumer';
    return {
      disabled:
        !deviceManager.selectedCamera ||
        !permission ||
        !deviceManager.cameras.length ||
        incapable ||
        callState === 'LocalHold',
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
  disabled?: boolean;
};

/**
 * Selector type for {@link RaiseHandButton} component.
 *
 * @public
 */
export type RaiseHandButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked?: boolean;
  disabled?: boolean;
};

/**
 * Selector for {@link RaiseHandButton} component.
 *
 * @public
 */
export const raiseHandButtonSelector: RaiseHandButtonSelector = reselect.createSelector(
  [getLocalParticipantRaisedHand, getCallState],
  (raisedHand, callState) => {
    return {
      checked: raisedHand ? true : false,
      disabled: callState === 'InLobby' ? true : callState === 'Connecting' ?? false
    };
  }
);

/**
 * Selector type for {@link ReactionButton} component.
 *
 * @public
 */
export type ReactionButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  checked?: boolean;
  disabled?: boolean;
};

/**
 * Selector for {@link ReactionButton} component.
 *
 * @public
 */
export const reactionButtonSelector: ReactionButtonSelector = reselect.createSelector(
  [getLocalParticipantReactionState, getCallState],
  (reaction, callState) => {
    return {
      checked: reaction ? true : false,
      disabled: callState !== 'Connected'
    };
  }
);

/**
 * Selector for {@link ScreenShareButton} component.
 *
 * @public
 */
export const screenShareButtonSelector: ScreenShareButtonSelector = reselect.createSelector(
  [getIsScreenSharingOn, getCallState, getCapabilities, getRole],
  (isScreenSharingOn, callState, capabilities, role) => {
    let disabled: boolean | undefined = undefined;

    disabled =
      disabled ||
      (capabilities?.shareScreen.isPresent === false && capabilities?.shareScreen.reason !== 'NotInitialized') ||
      role === 'Consumer' ||
      role === 'Attendee';
    disabled = disabled || ['InLobby', 'Connecting', 'LocalHold'].includes(callState ?? 'None');
    return {
      checked: isScreenSharingOn,
      disabled
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

/**
 * Selector for the {@link HoldButton} component.
 * @public
 */
export const holdButtonSelector: HoldButtonSelector = reselect.createSelector([getCallState], (callState) => {
  return {
    checked: callState === 'LocalHold'
  };
});
