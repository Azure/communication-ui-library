// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo } from '@azure/communication-calling';
import { MediaClientState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { MediaSessionBaseSelectorProps, getDeviceManager, getIsMuted, getSessionExists } from './baseSelectors';
/**
 * Selector type for {@link MicrophoneButton} component.
 *
 * @public
 */
export type MicrophoneButtonSelector = (
  state: MediaClientState,
  props: MediaSessionBaseSelectorProps
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
export const microphoneButtonMediaSessionSelector: MicrophoneButtonSelector = reselect.createSelector(
  [getSessionExists, getIsMuted, getDeviceManager],
  (sessionExists, isMuted, deviceManager) => {
    const permission = deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true;
    return {
      disabled: !sessionExists || !permission,
      checked: sessionExists ? !isMuted : false,
      microphones: deviceManager.microphones,
      speakers: deviceManager.speakers,
      selectedMicrophone: deviceManager.selectedMicrophone,
      selectedSpeaker: deviceManager.selectedSpeaker
    };
  }
);
