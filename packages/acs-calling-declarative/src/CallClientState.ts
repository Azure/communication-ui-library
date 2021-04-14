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
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

/**
 * State only version of {@Link @azure/communication-calling#LocalVideoStream}.
 */
export interface LocalVideoStream {
  /**
   * Proxy of {@Link @azure/communication-calling#LocalVideoStream.source}.
   */
  source: VideoDeviceInfo;
  /**
   * Proxy of {@Link @azure/communication-calling#LocalVideoStream.mediaStreamType}.
   */
  mediaStreamType: MediaStreamType;
}

/**
 * State only version of {@Link @azure/communication-calling#RemoteVideoStream}.
 */
export interface RemoteVideoStream {
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.id}.
   */
  id: number;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.mediaStreamType}.
   */
  mediaStreamType: MediaStreamType;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.isAvailable}.
   */
  isAvailable: boolean;
}

/**
 * State only version of {@Link @azure/communication-calling#RemoteParticipant}.
 */
export interface RemoteParticipant {
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.identifier}.
   */
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.displayName}.
   */
  displayName?: string;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.state}.
   */
  state: RemoteParticipantState;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.callEndReason}.
   */
  callEndReason?: CallEndReason;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.videoStreams}.
   */
  videoStreams: ReadonlyArray<RemoteVideoStream>;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.isMuted}.
   */
  isMuted: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.isSpeaking}.
   */
  isSpeaking: boolean;
}

/**
 * State only version of {@Link @azure/communication-calling#Call}. RemoteParticipants is a map of identifier
 * {@Link Converter.getRemoteParticipantKey} to {@Link @azure/communication-calling#RemoteParticipant}.
 */
export interface Call {
  /**
   * Proxy of {@Link @azure/communication-calling#Call.id}
   */
  id: string;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.callerInfo}
   */
  callerInfo: CallerInfo;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.state}
   */
  state: CallState;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.callEndReason}
   */
  callEndReason?: CallEndReason;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.direction}
   */
  direction: CallDirection;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.isMuted}.
   */
  isMuted: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.isScreenSharingOn}.
   */
  isScreenSharingOn: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.localVideoStreams}.
   */
  localVideoStreams: ReadonlyArray<LocalVideoStream>;
  /**
   * Proxy of {@Link @azure/communication-calling#Call.remoteParticipants}.
   */
  remoteParticipants: Map<string, RemoteParticipant>;
}

/**
 * State only version of {@Link @azure/communication-calling#IncomingCall}. CallEnded and callEndReason are added by the
 * declarative layer based on received events.
 */
export interface IncomingCall {
  /**
   * Proxy of {@Link @azure/communication-calling#IncomingCall.id}.
   */
  id: string;
  /**
   * Proxy of {@Link @azure/communication-calling#IncomingCall.callerInfo}.
   */
  callerInfo: CallerInfo;
  /**
   * Set to true when 'callEnded' event on {@Link @azure/communication-calling#IncomingCall} is received. Defaults to
   * false.
   */
  callEnded: boolean;
  /**
   * Set to the state returned by 'callEnded' event on {@Link @azure/communication-calling#IncomingCall} when received.
   * If it is undefined then no 'callEnded' event was received yet.
   */
  callEndReason?: CallEndReason;
}

/**
 * This type is meant to encapsulate all the state inside {@Link @azure/communication-calling#DeviceManager}. For
 * optional parameters they may not be available until permission is granted by the user.
 */
export type DeviceManagerState = {
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager.isSpeakerSelectionAvailable}.
   */
  isSpeakerSelectionAvailable: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager.isSpeakerSelectionAvailable}.
   */
  selectedMicrophone?: AudioDeviceInfo;
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager.selectedMicrophone}.
   */
  selectedSpeaker?: AudioDeviceInfo;
  /**
   * Stores any cameras data returned from {@Link @azure/communication-calling#DeviceManager.getCameras}.
   */
  cameras: VideoDeviceInfo[];
  /**
   * Stores any microphones data returned from {@Link @azure/communication-calling#DeviceManager.getMicrophones}.
   */
  microphones: AudioDeviceInfo[];
  /**
   * Stores any speakers data returned from {@Link @azure/communication-calling#DeviceManager.getSpeakers}.
   */
  speakers: AudioDeviceInfo[];
  /**
   * Stores deviceAccess data returned from {@Link @azure/communication-calling#DeviceManager.askDevicePermission}.
   */
  deviceAccess?: DeviceAccess;
};

/**
 * Container for all of the state data proxied by {@Link DeclarativeCallClient}. Calls is a map of Call.id to Call
 * {@Link Call}.
 */
export interface CallClientState {
  /**
   * Proxy of {@Link @azure/communication-calling#CallAgent.calls} as a map of Call {@Link Call}. It is keyed by
   * Call.id.
   */
  calls: Map<string, Call>;
  /**
   * Proxy of {@Link @azure/communication-calling#IncomingCall} as a map of IncomingCall {@Link IncomingCall} received
   * in the event 'incomingCall' emitted by {@Link @azure/communication-calling#CallAgent}. It is keyed by
   * IncomingCall.id.
   */
  incomingCalls: Map<string, IncomingCall>;
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager} and its events.
   */
  deviceManagerState: DeviceManagerState;
}
