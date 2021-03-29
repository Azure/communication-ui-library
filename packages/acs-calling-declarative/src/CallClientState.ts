// © Microsoft Corporation. All rights reserved.

import {
  AudioDeviceInfo,
  CallDirection,
  CallEndReason,
  CallerInfo,
  CallState,
  DeviceAccess,
  MediaStreamType,
  RemoteParticipantState,
  VideoDeviceInfo
} from '@azure/communication-calling';
import {
  CallingApplicationKind,
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

/**
 * State only version of LocalVideoStream.
 */
export interface LocalVideoStream {
  source: VideoDeviceInfo;
  mediaStreamType: MediaStreamType;
}

/**
 * State only version of RemoteVideoStream.
 */
export interface RemoteVideoStream {
  id: number;
  mediaStreamType: MediaStreamType;
  isAvailable: boolean;
}

/**
 * State only version of RemoteParticipant.
 */
export interface RemoteParticipant {
  identifier:
    | CommunicationUserKind
    | PhoneNumberKind
    | CallingApplicationKind
    | MicrosoftTeamsUserKind
    | UnknownIdentifierKind;
  displayName?: string;
  state: RemoteParticipantState;
  callEndReason?: CallEndReason;
  videoStreams: ReadonlyArray<RemoteVideoStream>;
  isMuted: boolean;
  isSpeaking: boolean;
}

/**
 * State only version of Call. RemoteParticipants is a map of identifier (Converter.GetRemoteParticipantKey) to
 * RemoteParticipant.
 */
export interface Call {
  id: string;
  callerInfo: CallerInfo;
  state: CallState;
  callEndReason?: CallEndReason;
  direction: CallDirection;
  isMicrophoneMuted: boolean;
  isScreenSharingOn: boolean;
  localVideoStreams: ReadonlyArray<LocalVideoStream>;
  remoteParticipants: Map<string, RemoteParticipant>;
}

/**
 * State only version of Call. CallEnded and callEndReason are added by the declarative layer based on received events.
 */
export interface IncomingCall {
  id: string;
  callerInfo: CallerInfo;
  callEnded: boolean;
  callEndReason?: CallEndReason;
}

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

/**
 * Calls is a map of Call.id to Call.
 */
export interface CallClientState {
  calls: Map<string, Call>;
  incomingCalls: Map<string, IncomingCall>;
  deviceManagerState: DeviceManagerState;
}
