// © Microsoft Corporation. All rights reserved.

import {
  CallDirection,
  CallEndReason,
  CallerInfo,
  CallState,
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
 * Calls is a map of Call.id to Call.
 */
export interface CallClientState {
  calls: Map<string, Call>;
  incomingCalls: Map<string, IncomingCall>;
}
