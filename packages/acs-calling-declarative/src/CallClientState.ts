// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, Call, DeviceAccess, VideoDeviceInfo } from '@azure/communication-calling';

/**
 * This type is meant to encapsulate all the state inside DeviceManager. For optional parameters they may not be
 * available until permission is granted. Cameras/Microphone/Speakers may be empty if deviceAccess is undefined (haven't
 * gotten permission from user).
 */
export type DeviceManagerState = {
  isSpeakerSelectionAvailable: boolean;
  selectedMicrophone?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  cameras: VideoDeviceInfo[];
  microphones: AudioDeviceInfo[];
  speakers: AudioDeviceInfo[];
  deviceAccess?: DeviceAccess;
};

export type CallClientState = {
  calls: Call[];
  deviceManagerState: DeviceManagerState;
};
