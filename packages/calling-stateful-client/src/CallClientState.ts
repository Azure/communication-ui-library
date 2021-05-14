// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  TransferErrorCode,
  TransferState,
  VideoDeviceInfo
} from '@azure/communication-calling';
import {
  CommunicationUserIdentifier,
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberIdentifier,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

/**
 * State only version of {@Link @azure/communication-calling#TransferRequestedEventArgs}. At the time of writing
 * Transfer Call is experimental. Not tested and not ready for consumption.
 */
export interface TransferRequest {
  targetParticipant: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind;
}

/**
 * State only version of {@Link @azure/communication-calling#Transfer}. At the time of writing Transfer Call is
 * experimental. Not tested and not ready for consumption.
 */
export interface Transfer {
  /**
   * Added by Declarative and used internally.
   */
  id: number;
  /**
   * Added by Declarative, stores the targetParticipant passed to
   * {@Link @azure/communication-calling#TransferCallFeature.transfer}
   */
  targetParticipant: CommunicationUserIdentifier | PhoneNumberIdentifier;
  /**
   * Proxy of {@Link @azure/communication-calling#Transfer.state}.
   */
  state: TransferState;
  /**
   * Proxy of {@Link @azure/communication-calling#Transfer.error}.
   */
  error?: TransferErrorCode;
}

/**
 * Holds all the state found in {@Link @azure/communication-calling#TransferCallFeature} and
 * {@Link @azure/communication-calling#Transfer}. At the time of writing Transfer Call is experimental. Not tested and
 * not ready for consumption.
 */
export interface TransferCallFeature {
  /**
   * These are requests received in the {@Link @azure/communication-calling#TransferCallFeature}'s 'transferRequested'
   * event. Only MAX_TRANSFER_REQUEST_LENGTH number of TransferRequest are kept in this array with the older ones being
   * replaced by newer ones. To accept/reject a transfer request, the {@Link @azure/communication-calling#Call} must be
   * used (TODO: do we want to provide an API?).
   */
  receivedTransferRequests: TransferRequest[];
  /**
   * These are requests initiated by the local user using {@Link StatefulCallClient.transfer}. Only
   * MAX_TRANSFER_REQUEST_LENGTH number of TransferRequest are kept in this array with the older ones being replaced by
   * newer ones.
   */
  requestedTransfers: Transfer[];
}

/**
 * State only version of {@Link @azure/communication-calling#CallAgent} except calls is moved to be a child directly of
 * {@Link CallClientState}. The reason to have CallAgent's state proxied is to provide access to displayName. We don't
 * flatten CallAgent.displayName and put it in CallClientState because it would be ambiguious that displayName is
 * actually reliant on the creation/existence of CallAgent to be available.
 */
export interface CallAgent {
  /**
   * Proxy of {@Link @azure/communication-calling#CallAgent.displayName}.
   */
  displayName?: string;
}

/**
 * State only version of {@Link @azure/communication-calling#TranscriptionCallFeature}.
 */
export interface TranscriptionCallFeature {
  /**
   * Proxy of {@Link @azure/communication-calling#TranscriptionCallFeature.isTranscriptionActive}.
   */
  isTranscriptionActive: boolean;
}

/**
 * State only version of {@Link @azure/communication-calling#RecordingCallFeature}.
 */
export interface RecordingCallFeature {
  /**
   * Proxy of {@Link @azure/communication-calling#RecordingCallFeature.isRecordingActive}.
   */
  isRecordingActive: boolean;
}

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
   * {@Link VideoStreamRendererViewAndStatus} that is managed by startRenderVideo/stopRenderVideo in
   * {@Link StatefulCallClient} API.
   */
  viewAndStatus: VideoStreamRendererViewAndStatus;
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
   * {@Link VideoStreamRendererViewAndStatus} that is managed by startRenderVideo/stopRenderVideo in
   * {@Link StatefulCallClient} API.
   */
  viewAndStatus: VideoStreamRendererViewAndStatus;
}

/**
 * Stores the status of a video render as rendering could take a long time.
 */
export type VideoStreamRendererViewStatus = 'NotRendered' | 'InProgress' | 'Completed' | 'Stopping';

/**
 * Contains the status {@Link VideoStreamRendererViewStatus} of a render and the view
 * {@Link VideoStreamRendererView} of that render. The {@Link VideoStreamRendererView} will be undefined if the
 * {@Link VideoStreamRendererViewStatus} is 'NotRendered' or 'InProgress'.
 */
export interface VideoStreamRendererViewAndStatus {
  status: VideoStreamRendererViewStatus;
  view: VideoStreamRendererView | undefined;
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
 * State only version of {@Link @azure/communication-calling#Call}.
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
   * {@Link Converter.getRemoteParticipantKey} to {@Link RemoteParticipant}
   */
  remoteParticipants: Map<string, RemoteParticipant>;
  /**
   * Stores remote participants that have left the call so that the callEndReason could be retrieved. Map of identifier
   * {@Link Converter.getRemoteParticipantKey} to {@Link RemoteParticipant}
   */
  remoteParticipantsEnded: Map<string, RemoteParticipant>;
  /**
   * Proxy of {@Link @azure/communication-calling#TranscriptionCallFeature}.
   */
  transcription: TranscriptionCallFeature;
  /**
   * Proxy of {@Link @azure/communication-calling#RecordingCallFeature}.
   */
  recording: RecordingCallFeature;
  /**
   * Proxy of {@Link @azure/communication-calling#TransferCallFeature} with some differences see
   * {@Link TransferCallFeature} for details.
   */
  transfer: TransferCallFeature;
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
export type DeviceManager = {
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager.isSpeakerSelectionAvailable}.
   */
  isSpeakerSelectionAvailable: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager.selectedMicrophone}.
   */
  selectedMicrophone?: AudioDeviceInfo;
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager.selectedSpeaker}.
   */
  selectedSpeaker?: AudioDeviceInfo;
  /**
   * Stores the selected camera device info. This is provided by the stateful layer and does not exist in the Calling
   * SDK. It must be explicitly set before use and does not persist across instances of the stateful client.
   */
  selectedCamera?: VideoDeviceInfo;
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
  /**
   * Stores created views that are not associated with any Call state (when
<<<<<<< HEAD
   * {@Link DeclarativeCallClient#startRenderVideo} is called with undefined callId and defined LocalVideoStream).
=======
   * {@Link StatefulCallClient#startRenderVideo} is called with undefined callId and LocalVideoStream).
>>>>>>> origin/main
   */
  unparentedViews: Map<LocalVideoStream, VideoStreamRendererViewAndStatus>;
};

/**
 * Container for all of the state data proxied by {@Link StatefulCallClient}. Calls is a map of Call.id to Call
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
   * Calls are pushed on to the array as they end, meaning this is sorted by endTime ascending. Only
   * MAX_CALL_HISTORY_LENGTH number of Calls are kept in this array with the older ones being replaced by newer ones.
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
   * is sorted by endTime ascending. Only MAX_CALL_HISTORY_LENGTH number of IncomingCalls are kept in this array with
   * the older ones being replaced by newer ones.
   */
  incomingCallsEnded: IncomingCall[];
  /**
   * Proxy of {@Link @azure/communication-calling#DeviceManager} and its events.
   */
  deviceManager: DeviceManager;
  /**
   * Proxy of {@Link @azure/communication-calling#CallAgent} without the calls property. Provides access to displayName
   * but only available if CallAgent has been created.
   */
  callAgent: CallAgent | undefined;
  /**
   * Stores a userId string. This is not used by the stateful client and is provided here as a convenience for the
   * developer for easier access to userId. Must be passed in at initialization of the stateful client.
   */
  userId: string;
}
