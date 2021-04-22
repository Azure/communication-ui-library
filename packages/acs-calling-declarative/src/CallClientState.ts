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
  ScalingMode,
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
  /**
   * {@Link VideoStreamRendererView} is added/removed from state by startRenderVideo/stopRenderVideo in
   * {@Link DeclarativeCallClient} API.
   */
  videoStreamRendererView: VideoStreamRendererView | undefined;
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
  /**
   * {@Link VideoStreamRendererView} is added/removed from state by startRenderVideo/stopRenderVideo in
   * {@Link DeclarativeCallClient} API.
   */
  videoStreamRendererView: VideoStreamRendererView | undefined;
}

/**
 * State only version of {@Link @azure/communication-calling#VideoStreamRendererView}. TODO: Do we want to provide an
 * API for updateScalingMode? There is a way to change scaling mode which is to stop the video and start it again with
 * the desired scaling mode option.
 */
export interface VideoStreamRendererView {
  /**
   * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.scalingMode}.
   */
  scalingMode: ScalingMode;
  /**
   * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.isMirrored}.
   */
  isMirrored: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.target}.
   */
  target: HTMLElement;
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
   * Proxy of {@Link @azure/communication-calling#RemoteParticipant.videoStreams} as a map of
   * {@Link @azure/communication-calling#RemoteVideoStream.id} to {@Link RemoteVideoStream}.
   */
  videoStreams: Map<number, RemoteVideoStream>;
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
 * State only version of {@Link @azure/communication-calling#Call}. RemoteParticipants is a .
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
  localVideoStreams: LocalVideoStream[];
  /**
   * Proxy of {@Link @azure/communication-calling#Call.remoteParticipants}. Map of identifier
   * {@Link Converter.getRemoteParticipantKey} to {@Link @azure/communication-calling#RemoteParticipant}
   */
  remoteParticipants: Map<string, RemoteParticipant>;
  /**
   * Stores remote participants that have left the call so that the callEndReason could be retrieved. Map of identifier
   * {@Link Converter.getRemoteParticipantKey} to {@Link @azure/communication-calling#RemoteParticipant}
   */
  remoteParticipantsEnded: Map<string, RemoteParticipant>;
  /**
   * Stores the local date when the call started on the client. This is not originally in the SDK but provided by the
   * Declarative layer.
   */
  startTime: Date;
  /**
   * Stores the local date when the call ended on the client. This is not originally in the SDK but provided by the
   * Declarative layer. It is undefined if the call is not ended yet.
   */
  endTime: Date | undefined;
}

/**
 * State only version of {@Link @azure/communication-calling#IncomingCall}. CallEndReason is added by the declarative
 * layer based on received events.
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
   * Set to the state returned by 'callEnded' event on {@Link @azure/communication-calling#IncomingCall} when received.
   */
  callEndReason?: CallEndReason;
  /**
   * Stores the local date when the call started on the client. This is not originally in the SDK but provided by the
   * Declarative layer.
   */
  startTime: Date;
  /**
   * Stores the local date when the call ended on the client. This is not originally in the SDK but provided by the
   * Declarative layer. It is undefined if the call is not ended yet.
   */
  endTime: Date | undefined;
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
   * Calls that have ended are stored here so the callEndReason could be checked. It is an array of Call {@Link Call}.
   * Calls are pushed on to the array as they end, meaning this is sorted by endTime ascending.
   */
  callsEnded: Call[];
  /**
   * Proxy of {@Link @azure/communication-calling#IncomingCall} as a map of IncomingCall {@Link IncomingCall} received
   * in the event 'incomingCall' emitted by {@Link @azure/communication-calling#CallAgent}. It is keyed by
   * IncomingCall.id.
   */
  incomingCalls: Map<string, IncomingCall>;
  /**
   * Incoming Calls that have ended are stored here so the callEndReason could be checked. It is a array of IncomingCall
   * {@Link IncomingCall} received in the event 'incomingCall' emitted by
   * {@Link @azure/communication-calling#CallAgent}. IncomingCalls are pushed on to the array as they end, meaning this
   * is sorted by endTime ascending.
   */
  incomingCallsEnded: IncomingCall[];
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager} and its events.
   */
  deviceManagerState: DeviceManagerState;
}
