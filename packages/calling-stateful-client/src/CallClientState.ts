// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AudioDeviceInfo,
  CallDirection,
  CallEndReason,
  CallerInfo,
  CallState as CallStatus,
  DeviceAccess,
  DominantSpeakersInfo,
  LatestMediaDiagnostics,
  LatestNetworkDiagnostics,
  MediaStreamType,
  RemoteParticipantState as RemoteParticipantStatus,
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
 * State only version of {@link @azure/communication-calling#TransferRequestedEventArgs}. At the time of writing
 * Transfer Call is experimental. Not tested and not ready for consumption.
 */
export interface TransferRequest {
  targetParticipant: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind;
}

/**
 * State only version of {@link @azure/communication-calling#Transfer}. At the time of writing Transfer Call is
 * experimental. Not tested and not ready for consumption.
 * @experimental
 */
export interface Transfer {
  /**
   * Added by Declarative and used internally.
   */
  id: number;
  /**
   * Added by {@link StatefulClientClient}, stores the targetParticipant passed to
   * {@link @azure/communication-calling#TransferCallFeature.transfer}
   */
  targetParticipant: CommunicationUserIdentifier | PhoneNumberIdentifier;
  /**
   * Proxy of {@link @azure/communication-calling#Transfer.state}.
   */
  state: TransferState;
  /**
   * Proxy of {@link @azure/communication-calling#Transfer.error}.
   */
  error?: TransferErrorCode;
}

/**
 * Holds all the state found in {@link @azure/communication-calling#TransferCallFeature} and
 * {@link @azure/communication-calling#Transfer}. At the time of writing Transfer Call is experimental. Not tested and
 * not ready for consumption.
 */
export interface TransferCallFeatureState {
  /**
   * These are requests received in the {@link @azure/communication-calling#TransferCallFeature}'s 'transferRequested'
   * event. Only MAX_TRANSFER_REQUEST_LENGTH number of TransferRequest are kept in this array with the older ones being
   * replaced by newer ones. To accept/reject a transfer request, the {@link @azure/communication-calling#Call} must be
   * used (TODO: do we want to provide an API?).
   */
  receivedTransferRequests: TransferRequest[];
  /**
   * These are requests initiated by the local user using {@link StatefulCallClient.transfer}. Only
   * MAX_TRANSFER_REQUEST_LENGTH number of TransferRequest are kept in this array with the older ones being replaced by
   * newer ones.
   */
  requestedTransfers: Transfer[];
}

/**
 * State only version of {@link @azure/communication-calling#CallAgent} except calls is moved to be a child directly of
 * {@link CallClientState} and not included here. The reason to have CallAgent's state proxied is to provide access to
 * displayName. We don't flatten CallAgent.displayName and put it in CallClientState because it would be ambiguious that
 * displayName is actually reliant on the creation/existence of CallAgent to be available.
 */
export interface CallAgentState {
  /**
   * Proxy of {@link @azure/communication-calling#CallAgent.displayName}.
   */
  displayName?: string;
}

/**
 * State only version of {@link @azure/communication-calling#TranscriptionCallFeature}. {@link StatefulCallClient} will
 * automatically listen for transcription state of the call and update the state exposed by {@link StatefulCallClient}
 * accordingly.
 */
export interface TranscriptionCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#TranscriptionCallFeature.isTranscriptionActive}.
   */
  isTranscriptionActive: boolean;
}

/**
 * State only version of {@link @azure/communication-calling#RecordingCallFeature}. {@link StatefulCallClient} will
 * automatically listen for recording state of the call and update the state exposed by {@link StatefulCallClient} accordingly.
 */
export interface RecordingCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#RecordingCallFeature.isRecordingActive}.
   */
  isRecordingActive: boolean;
}

/**
 * State only version of {@link @azure/communication-calling#LocalVideoStream}.
 */
export interface LocalVideoStreamState {
  /**
   * Proxy of {@link @azure/communication-calling#LocalVideoStream.source}.
   */
  source: VideoDeviceInfo;
  /**
   * Proxy of {@link @azure/communication-calling#LocalVideoStream.mediaStreamType}.
   */
  mediaStreamType: MediaStreamType;
  /**
   * {@link VideoStreamRendererView} that is managed by createView/disposeView in {@link StatefulCallClient}
   * API. This can be undefined if the stream has not yet been rendered and defined after createView creates the view.
   */
  view?: VideoStreamRendererViewState;
}

/**
 * State only version of {@link @azure/communication-calling#RemoteVideoStream}.
 */
export interface RemoteVideoStreamState {
  /**
   * Proxy of {@link @azure/communication-calling#RemoteVideoStream.id}.
   */
  id: number;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteVideoStream.mediaStreamType}.
   */
  mediaStreamType: MediaStreamType;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteVideoStream.isAvailable}.
   */
  isAvailable: boolean;
  /**
   * {@link VideoStreamRendererView} that is managed by createView/disposeView in {@link StatefulCallClient}
   * API. This can be undefined if the stream has not yet been rendered and defined after createView creates the view.
   */
  view?: VideoStreamRendererViewState;
}

/**
 * State only version of {@link @azure/communication-calling#VideoStreamRendererView}. Currently no API is provided to
 * modify scalingMode after the stream as been rendered by {@link StatefulCallClient}. In order to change scalingMode
 * stop rendering the stream and re-start it using the desired scalingMode. This property is added to the state exposed
 * by {@link StatefulCallClient} by {@link StatefulCallClient.createView} and removed by
 * {@link StatefulCallClient.disposeView}.
 */
export interface VideoStreamRendererViewState {
  /**
   * Proxy of {@link @azure/communication-calling#VideoStreamRendererView.scalingMode}.
   */
  scalingMode: ScalingMode;
  /**
   * Proxy of {@link @azure/communication-calling#VideoStreamRendererView.isMirrored}.
   */
  isMirrored: boolean;
  /**
   * Proxy of {@link @azure/communication-calling#VideoStreamRendererView.target}.
   */
  target: HTMLElement;
}

/**
 * State only version of {@link @azure/communication-calling#RemoteParticipant}. {@link StatefulCallClient} will
 * automatically retrieve RemoteParticipants and add their state to the state exposed by {@link StatefulCallClient}.
 */
export interface RemoteParticipantState {
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.identifier}.
   */
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.displayName}.
   */
  displayName?: string;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.state}.
   */
  state: RemoteParticipantStatus;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.callEndReason}.
   */
  callEndReason?: CallEndReason;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.videoStreams} as an object with
   * {@link RemoteVideoStream} fields keyed by {@link @azure/communication-calling#RemoteVideoStream.id}.
   */
  videoStreams: { [key: number]: RemoteVideoStreamState };
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.isMuted}.
   */
  isMuted: boolean;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.isSpeaking}.
   */
  isSpeaking: boolean;
}

/**
 * State only version of {@link @azure/communication-calling#Call}. {@link StatefulCallClient} will automatically
 * retrieve Call's state and add it to the state exposed by {@link StatefulCallClient}.
 */
export interface CallState {
  /**
   * Proxy of {@link @azure/communication-calling#Call.id}.
   */
  id: string;
  /**
   * Proxy of {@link @azure/communication-calling#Call.callerInfo}.
   */
  callerInfo: CallerInfo;
  /**
   * Proxy of {@link @azure/communication-calling#Call.state}.
   */
  state: CallStatus;
  /**
   * Proxy of {@link @azure/communication-calling#Call.callEndReason}.
   */
  callEndReason?: CallEndReason;
  /**
   * Proxy of {@link @azure/communication-calling#Call.direction}.
   */
  direction: CallDirection;
  /**
   * Proxy of {@link @azure/communication-calling#Call.isMuted}.
   */
  isMuted: boolean;
  /**
   * Proxy of {@link @azure/communication-calling#Call.isScreenSharingOn}.
   */
  isScreenSharingOn: boolean;
  /**
   * Proxy of {@link @azure/communication-calling#DominantSpeakersInfo }.
   */
  dominantSpeakers?: DominantSpeakersInfo;
  /**
   * Proxy of {@link @azure/communication-calling#Call.localVideoStreams}.
   */
  localVideoStreams: LocalVideoStreamState[];
  /**
   * Proxy of {@link @azure/communication-calling#Call.remoteParticipants}.
   * Object with {@link RemoteParticipant} fields keyed by flattened {@link RemoteParticipantState.identifier}.
   * To obtain a flattened {@link RemoteParticipantState.identifier}, use
   * {@link @azure/communication-react#toFlatCommunicationIdentifier}.
   */
  remoteParticipants: { [keys: string]: RemoteParticipantState };
  /**
   * Stores remote participants that have left the call so that the callEndReason could be retrieved.
   * Object with {@link RemoteParticipant} fields keyed by flattened {@link RemoteParticipantState.identifier}.
   * To obtain a flattened {@link RemoteParticipantState.identifier}, use
   * {@link @azure/communication-react#toFlatCommunicationIdentifier}.
   */
  remoteParticipantsEnded: { [keys: string]: RemoteParticipantState };
  /**
   * Proxy of {@link @azure/communication-calling#TranscriptionCallFeature}.
   */
  transcription: TranscriptionCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#RecordingCallFeature}.
   */
  recording: RecordingCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#TransferCallFeature} with some differences see
   * {@link TransferCallFeatureState} for details.
   */
  transfer: TransferCallFeatureState;
  /**
   * Stores the currently active screenshare participant's key. If there is no screenshare active, then this will be
   * undefined. You can use this key to access the remoteParticipant data in {@link CallState.remoteParticipants} object.
   *
   * Note this only applies to ScreenShare in RemoteParticipant. A local ScreenShare being active will not affect this
   * property.
   *
   * This property is added by the stateful layer and is not a proxy of SDK state
   */
  screenShareRemoteParticipant: string | undefined;
  /**
   * Stores the local date when the call started on the client. This property is added by the stateful layer and is not
   * a proxy of SDK state.
   */
  startTime: Date;
  /**
   * Stores the local date when the call ended on the client. This property is added by the stateful layer and is not
   * a proxy of SDK state.
   */
  endTime: Date | undefined;

  /**
   * Stores the latest call diagnostics.
   */
  diagnostics: DiagnosticsCallFeatureState;
}

/**
 * State only version of {@link @azure/communication-calling#IncomingCall}. {@link StatefulCallClient} will
 * automatically detect incoming calls and add their state to the state exposed by {@link StatefulCallClient}.
 */
export interface IncomingCallState {
  /**
   * Proxy of {@link @azure/communication-calling#IncomingCall.id}.
   */
  id: string;
  /**
   * Proxy of {@link @azure/communication-calling#IncomingCall.callerInfo}.
   */
  callerInfo: CallerInfo;
  /**
   * Set to the state returned by 'callEnded' event on {@link @azure/communication-calling#IncomingCall} when received.
   * This property is added by the stateful layer and is not a proxy of SDK state.
   */
  callEndReason?: CallEndReason;
  /**
   * Stores the local date when the call started on the client. This property is added by the stateful layer and is not
   * a proxy of SDK state.
   */
  startTime: Date;
  /**
   * Stores the local date when the call ended on the client. This property is added by the stateful layer and is not a
   * proxy of SDK state. It is undefined if the call is not ended yet.
   */
  endTime: Date | undefined;
}

/**
 * This type is meant to encapsulate all the state inside {@link @azure/communication-calling#DeviceManager}. For
 * optional parameters they may not be available until permission is granted by the user. The cameras, microphones,
 * speakers, and deviceAccess states will be empty until the corresponding
 * {@link @azure/communication-calling#DeviceManager}'s getCameras, getMicrophones, getSpeakers, and askDevicePermission
 * APIs are called and completed.
 */
export type DeviceManagerState = {
  /**
   * Proxy of {@link @azure/communication-calling#DeviceManager.isSpeakerSelectionAvailable}.
   */
  isSpeakerSelectionAvailable: boolean;
  /**
   * Proxy of {@link @azure/communication-calling#DeviceManager.selectedMicrophone}.
   */
  selectedMicrophone?: AudioDeviceInfo;
  /**
   * Proxy of {@link @azure/communication-calling#DeviceManager.selectedSpeaker}.
   */
  selectedSpeaker?: AudioDeviceInfo;
  /**
   * Stores the selected camera device info. This is added by the stateful layer and does not exist in the Calling SDK.
   * It is meant as a convenience to the developer. It must be explicitly set before it has any value and does not
   * persist across instances of the {@link StatefulCallClient}. The developer controls entirely what this value holds
   * at any time.
   */
  selectedCamera?: VideoDeviceInfo;
  /**
   * Stores any cameras data returned from {@link @azure/communication-calling#DeviceManager.getCameras}.
   */
  cameras: VideoDeviceInfo[];
  /**
   * Stores any microphones data returned from {@link @azure/communication-calling#DeviceManager.getMicrophones}.
   */
  microphones: AudioDeviceInfo[];
  /**
   * Stores any speakers data returned from {@link @azure/communication-calling#DeviceManager.getSpeakers}.
   */
  speakers: AudioDeviceInfo[];
  /**
   * Stores deviceAccess data returned from {@link @azure/communication-calling#DeviceManager.askDevicePermission}.
   */
  deviceAccess?: DeviceAccess;
  /**
   * Stores created views that are not associated with any CallState (when {@link StatefulCallClient.createView} is
   * called with undefined callId, undefined participantId, and defined LocalVideoStream).
   *
   * The values in this array are generated internally when {@link StatefulCallClient.createView} is called and are
   * considered immutable.
   */
  unparentedViews: LocalVideoStreamState[];
};

/**
 * Container for all of the state data proxied by {@link StatefulCallClient}. The calls, callsEnded, incomingCalls, and
 * incomingCallsEnded states will be automatically provided if a callAgent has been created. The deviceManager will be
 * empty initially until populated see {@link DeviceManagerState}. The userId state is provided as a convenience for the
 * developer and is completely controled and set by the developer.
 */
export interface CallClientState {
  /**
   * Proxy of {@link @azure/communication-calling#CallAgent.calls} as an object with CallState {@link CallState} fields.
   * It is keyed by {@link @azure/communication-calling#Call.id}. Please note that
   * {@link @azure/communication-calling#Call.id} could change. You should not cache the id itself but the entire
   * {@link @azure/communication-calling#Call} and then use the id contained to look up data in this map.
   */
  calls: { [key: string]: CallState };
  /**
   * Calls that have ended are stored here so the callEndReason could be checked. It is an array of CallState
   * {@link CallState}. Calls are pushed on to the array as they end, meaning this is sorted by endTime ascending. Only
   * {@link MAX_CALL_HISTORY_LENGTH} number of Calls are kept in this array with the older ones being replaced by newer
   * ones.
   */
  callsEnded: CallState[];
  /**
   * Proxy of {@link @azure/communication-calling#IncomingCall} as an object with IncomingCall {@link IncomingCall} fields.
   * It is keyed by {@link @azure/communication-calling#IncomingCall.id}.
   */
  incomingCalls: { [key: string]: IncomingCallState };
  /**
   * Incoming Calls that have ended are stored here so the callEndReason could be checked. It is a array of IncomingCall
   * {@link IncomingCall} received in the event 'incomingCall' emitted by
   * {@link @azure/communication-calling#CallAgent}. IncomingCalls are pushed on to the array as they end, meaning this
   * is sorted by endTime ascending. Only MAX_CALL_HISTORY_LENGTH number of IncomingCalls are kept in this array with
   * the older ones being replaced by newer ones.
   */
  incomingCallsEnded: IncomingCallState[];
  /**
   * Proxy of {@link @azure/communication-calling#DeviceManager}. Please review {@link DeviceManagerState}.
   */
  deviceManager: DeviceManagerState;
  /**
   * Proxy of {@link @azure/communication-calling#CallAgent}. Please review {@link CallAgentState}.
   */
  callAgent?: CallAgentState;
  /**
   * Stores a userId. This is not used by the {@link StatefulCallClient} and is provided here as a convenience for the
   * developer for easier access to userId. Must be passed in at initialization of the {@link StatefulCallClient}.
   * Completely controlled by the developer.
   */
  userId: CommunicationUserKind;
  /**
   * Stores the latest error for each API method.
   *
   * See documentation of {@Link CallErrors} for details.
   */
  latestErrors: CallErrors;
}

/**
 * Errors teed from API calls to the Calling SDK.
 *
 * Each property in the object stores the latest error for a particular SDK API method.
 *
 * Errors from this object can be cleared using the {@link newClearCallErrorsModifier}.
 * Additionally, errors are automatically cleared when:
 * - The state is cleared.
 * - Subsequent calls to related API methods succeed.
 * See documentation of individual stateful client methods for details on when errors may be automatically cleared.
 */
export type CallErrors = {
  [target in CallErrorTarget]: CallError;
};

/**
 * Error thrown from failed stateful API methods.
 */
export class CallError extends Error {
  /**
   * The API method target that failed.
   */
  public target: CallErrorTarget;
  /**
   * Error thrown by the failed SDK method.
   */
  public inner: Error;
  /**
   * Timestamp added to the error by the stateful layer.
   */
  public timestamp: Date;

  constructor(target: CallErrorTarget, inner: Error, timestamp?: Date) {
    super();
    this.target = target;
    this.inner = inner;
    // Testing note: It is easier to mock Date::now() than the Date() constructor.
    this.timestamp = timestamp ?? new Date(Date.now());
    this.name = 'CallError';
    this.message = `${this.target}: ${this.inner.message}`;
  }
}

/**
 * String literal type for all permissible keys in {@Link CallErrors}.
 */
export type CallErrorTarget =
  | 'Call.addParticipant'
  | 'Call.api'
  | 'Call.hangUp'
  | 'Call.hold'
  | 'Call.mute'
  | 'Call.off'
  | 'Call.on'
  | 'Call.removeParticipant'
  | 'Call.resume'
  | 'Call.sendDtmf'
  | 'Call.startScreenSharing'
  | 'Call.startVideo'
  | 'Call.stopScreenSharing'
  | 'Call.stopVideo'
  | 'Call.unmute'
  | 'CallAgent.dispose'
  | 'CallAgent.join'
  | 'CallAgent.off'
  | 'CallAgent.on'
  | 'CallAgent.startCall'
  | 'CallClient.createCallAgent'
  | 'CallClient.getDeviceManager'
  | 'DeviceManager.askDevicePermission'
  | 'DeviceManager.getCameras'
  | 'DeviceManager.getMicrophones'
  | 'DeviceManager.getSpeakers'
  | 'DeviceManager.off'
  | 'DeviceManager.on'
  | 'DeviceManager.selectMicrophone'
  | 'DeviceManager.selectSpeaker';

/**
 * State only proxy for {@link @azure/communication-calling#DiagnosticsCallFeature}.
 */
export interface DiagnosticsCallFeatureState {
  /**
   * Stores diagnostics related to network conditions.
   */
  network: NetworkDiagnosticsState;

  /**
   * Stores diagnostics related to media quality.
   */
  media: MediaDiagnosticsState;
}

/**
 * State only proxy for {@link @azure/communication-calling#NetworkDiagnostics}.
 */
export interface NetworkDiagnosticsState {
  latest: LatestNetworkDiagnostics;
}

/**
 * State only proxy for {@link @azure/communication-calling#MediaDiagnostics}.
 */
export interface MediaDiagnosticsState {
  latest: LatestMediaDiagnostics;
}
