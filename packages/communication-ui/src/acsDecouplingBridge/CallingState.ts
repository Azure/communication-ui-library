// © Microsoft Corporation. All rights reserved.

import {
  RemoteParticipant,
  LocalVideoStream,
  VideoDeviceInfo,
  AudioDeviceInfo,
  PermissionState,
  CallState as CallStatus
} from '@azure/communication-calling';
import { ParticipantStream } from '../types/ParticipantStream';

// don't expose types with imperative logic directly: Call, CallClient, CallAgent, DeviceManager
// instead expose that functionality as handlers

export interface DevicesState {
  audioDevicePermission: PermissionState;
  selectedMicrophone: AudioDeviceInfo | undefined;
  microphones: AudioDeviceInfo[];
  videoDevicePermission: PermissionState;
  selectedCamera: VideoDeviceInfo | undefined;
  cameras: VideoDeviceInfo[];
}

export interface CallState {
  isInitialized: boolean;
  status: CallStatus;
  participants: RemoteParticipant[];
  screenShareStream: ParticipantStream | undefined;
  displayName: string;
  isMicrophoneEnabled: boolean;
  localScreenShareActive: boolean;
  localVideoStream: LocalVideoStream | undefined;
  rawLocalMediaStream: MediaProvider | null;
  localVideoElement: HTMLElement | undefined;
  isLocalVideoOn: boolean;
}
/**

  Declarative Calling state // ACS dep

// compState.callState = useSelector(selectForGroupCallComposite)  // runs against declarative state, selector comes from -selector package
// compState.otherStuff

Does GroupCall need to have the full GroupCallState?

  Composite state // no ACS dep

  useSelector(selector) // no ACS dependency

 */

// TODO: split for adapter, and for composite UI?
export interface CallingState {
  userId: string;
  devices: DevicesState;
  call: CallState;
}

// have hooks instead of properties?
// use = (get, set)
export const emptyCallingState: CallingState = {
  userId: '',
  devices: {
    audioDevicePermission: 'Unknown',
    selectedMicrophone: undefined,
    microphones: [],
    videoDevicePermission: 'Unknown',
    selectedCamera: undefined,
    cameras: []
  },
  call: {
    isInitialized: false,
    status: 'None',
    participants: [],
    screenShareStream: undefined,
    displayName: '',
    isMicrophoneEnabled: false,
    localScreenShareActive: false,
    localVideoStream: undefined,
    localVideoElement: undefined,
    rawLocalMediaStream: null,
    isLocalVideoOn: false
  }
};
