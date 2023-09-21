// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CallClientState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  CallingBaseSelectorProps,
  getCallExists,
  getDeviceManager,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams
} from './baseSelectors';
/* @conditional-compile-remove(capabilities) */
import { getCapabilites, getRole } from './baseSelectors';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(raise-hand) */
import { getCallState } from './baseSelectors';
import { _isPreviewOn } from './utils/callUtils';
/* @conditional-compile-remove(raise-hand) */
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
  [
    getCallExists,
    getIsMuted,
    getDeviceManager,
    /* @conditional-compile-remove(capabilities) */ getCapabilites,
    /* @conditional-compile-remove(capabilities) */ getRole
  ],
  (
    callExists,
    isMuted,
    deviceManager,
    /* @conditional-compile-remove(capabilities) */ capabilities,
    /* @conditional-compile-remove(capabilities) */ role
  ) => {
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;
    /* @conditional-compile-remove(capabilities) */
    const incapable =
      (capabilities?.unmuteMic.isPresent === false && capabilities?.unmuteMic.reason !== 'NotInitialized') ||
      role === 'Consumer';
    return {
      disabled: !callExists || !permission || /* @conditional-compile-remove(capabilities) */ incapable,
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
  [
    getLocalVideoStreams,
    getDeviceManager,
    /* @conditional-compile-remove(capabilities) */ getCapabilites,
    /* @conditional-compile-remove(capabilities) */ getRole
  ],
  (
    localVideoStreams,
    deviceManager,
    /* @conditional-compile-remove(capabilities) */ capabilities,
    /* @conditional-compile-remove(capabilities) */ role
  ) => {
    const previewOn = _isPreviewOn(deviceManager);
    const localVideoFromCall = localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video');
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true;
    /* @conditional-compile-remove(capabilities) */
    const incapable =
      (capabilities?.turnVideoOn.isPresent === false && capabilities?.turnVideoOn.reason !== 'NotInitialized') ||
      role === 'Consumer';
    return {
      disabled:
        !deviceManager.selectedCamera ||
        !permission ||
        !deviceManager.cameras.length ||
        /* @conditional-compile-remove(capabilities) */ incapable,
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
  /* @conditional-compile-remove(capabilities) */ /* @conditional-compile-remove(PSTN-calls) */ disabled?: boolean;
};

/* @conditional-compile-remove(raise-hand) */
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

/* @conditional-compile-remove(raise-hand) */
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
 * Selector for {@link ScreenShareButton} component.
 *
 * @public
 */
export const screenShareButtonSelector: ScreenShareButtonSelector = reselect.createSelector(
  [
    getIsScreenSharingOn,
    /* @conditional-compile-remove(PSTN-calls) */ getCallState,
    /* @conditional-compile-remove(capabilities) */ getCapabilites,
    /* @conditional-compile-remove(capabilities) */ getRole
  ],
  (
    isScreenSharingOn,
    /* @conditional-compile-remove(PSTN-calls) */ callState,
    /* @conditional-compile-remove(capabilities) */ capabilities,
    /* @conditional-compile-remove(capabilities) */ role
  ) => {
    let disabled: boolean | undefined = undefined;
    /* @conditional-compile-remove(capabilities) */
    disabled =
      disabled ||
      (capabilities?.shareScreen.isPresent === false && capabilities?.shareScreen.reason !== 'NotInitialized') ||
      role === 'Consumer' ||
      role === 'Attendee';
    /* @conditional-compile-remove(PSTN-calls) */
    disabled = disabled || ['InLobby', 'Connecting', 'LocalHold'].includes(callState);
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
