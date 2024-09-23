// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AudioDeviceInfo,
  CallDirection,
  CallEndReason,
  CallerInfo,
  CallState as CallStatus,
  DeviceAccess,
  DominantSpeakersInfo,
  IncomingCallKind,
  LatestMediaDiagnostics,
  LatestNetworkDiagnostics,
  MediaStreamType,
  ParticipantRole,
  RemoteParticipantState as RemoteParticipantStatus,
  ScalingMode,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoom, BreakoutRoomsSettings } from '@azure/communication-calling';
/* @conditional-compile-remove(remote-ufd) */
import type {
  ServerDiagnosticType,
  MediaDiagnosticType,
  NetworkDiagnosticType,
  DiagnosticValueType,
  DiagnosticQuality,
  DiagnosticFlag
} from '@azure/communication-calling';
import { TeamsCallInfo } from '@azure/communication-calling';
import { CallInfo } from '@azure/communication-calling';

import { CapabilitiesChangeInfo, ParticipantCapabilities } from '@azure/communication-calling';
import { CaptionsResultType } from '@azure/communication-calling';
/* @conditional-compile-remove(acs-close-captions) */
import { CaptionsKind } from '@azure/communication-calling';
import { VideoEffectName } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { CallKind } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ReactionMessage } from '@azure/communication-calling';
import { SpotlightedParticipant } from '@azure/communication-calling';
/* @conditional-compile-remove(local-recording-notification) */
import { LocalRecordingInfo, RecordingInfo } from '@azure/communication-calling';

/**
 * State only version of {@link @azure/communication-calling#CallAgent} except calls is moved to be a child directly of
 * {@link CallClientState} and not included here. The reason to have CallAgent's state proxied is to provide access to
 * displayName. We don't flatten CallAgent.displayName and put it in CallClientState because it would be ambiguious that
 * displayName is actually reliant on the creation/existence of CallAgent to be available.
 *
 * @public
 */
export interface CallAgentState {
  /**
   * Proxy of {@link @azure/communication-calling#CallAgent.displayName}.
   */
  displayName?: string;
}

/**
 * @public
 */
export interface CaptionsInfo {
  /**
   * The state in which this caption data can be classified.
   */
  resultType: CaptionsResultType;
  /**
   * The information of the call participant who spoke the captioned text.
   */
  speaker: CallerInfo;
  /**
   * The language that the spoken words were interpretted as. Corresponds to the language specified in startCaptions / setSpokenLanguage.
   */
  spokenLanguage: string;
  /**
   * The caption text.
   */
  captionText: string;
  /**
   * Timestamp of when the captioned words were initially spoken.
   */
  timestamp: Date;
  /**
   * The language that the captions are presented in. Corresponds to the captionLanguage specified in startCaptions / setCaptionLanguage.
   */
  captionLanguage?: string;
  /**
   * The original spoken caption text prior to translating to subtitle language
   */
  spokenText?: string;
}

/**
 * @public
 */
export interface CaptionsCallFeatureState {
  /**
   * supported spoken languages
   */
  supportedSpokenLanguages: string[];
  /**
   * array of received captions
   */
  captions: CaptionsInfo[];
  /**
   * whether captions is on/off
   */
  isCaptionsFeatureActive: boolean;
  /**
   * whether start captions button is clicked or now
   */
  startCaptionsInProgress: boolean;
  /**
   * supported caption languages
   */
  supportedCaptionLanguages: string[];
  /**
   * current spoken language
   */
  currentSpokenLanguage: string;
  /**
   * current caption language
   */
  currentCaptionLanguage: string;
  /* @conditional-compile-remove(acs-close-captions) */
  /**
   * current caption kind: teams or acs captions
   */
  captionsKind: CaptionsKind;
}

/**
 * State only version of {@link @azure/communication-calling#TranscriptionCallFeature}. {@link StatefulCallClient} will
 * automatically listen for transcription state of the call and update the state exposed by {@link StatefulCallClient}
 * accordingly.
 *
 * @public
 */
export interface TranscriptionCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#TranscriptionCallFeature.isTranscriptionActive}.
   */
  isTranscriptionActive: boolean;
}

/**
 * State only version of {@link @azure/communication-calling#CapabilitiesFeature}
 *
 * @public
 */
export interface CapabilitiesFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#CapabilitiesFeature.capabilities}.
   */
  capabilities: ParticipantCapabilities;
  /**
   * Proxy of the latest {@link @azure/communication-calling#CapabilitiesChangeInfo}
   */
  latestCapabilitiesChangeInfo: CapabilitiesChangeInfo;
}

/**
 * State only version of {@link @azure/communication-calling#SpotlightCallFeature}
 *
 * @public
 */
export interface SpotlightCallFeatureState {
  /**
   * Ordered array of spotlighted participants in call
   */
  spotlightedParticipants: SpotlightedParticipant[];
  /**
   * Local participant spotlight
   */
  localParticipantSpotlight?: SpotlightState;
  /**
   * Proxy of {@link @azure/communication-calling#SpotlightCallFeature.maxParticipantsToSpotlight}.
   */
  maxParticipantsToSpotlight: number;
}

/**
 * Spotlight state with order
 *
 * @public
 */
export interface SpotlightState {
  /**
   * Order position of spotlight in call
   */
  spotlightedOrderPosition?: number;
}

/* @conditional-compile-remove(breakout-rooms) */
/**
 * Breakout rooms state
 *
 * @public
 */
export interface BreakoutRoomsState {
  assignedBreakoutRoom?: BreakoutRoom;
  breakoutRoomSettings?: BreakoutRoomsSettings;
  breakoutRoomOriginCallId?: string;
  breakoutRoomDisplayName?: string;
}

/**
 * State only version of {@link @azure/communication-calling#RecordingCallFeature}. {@link StatefulCallClient} will
 * automatically listen for recording state of the call and update the state exposed by {@link StatefulCallClient} accordingly.
 *
 * @public
 */
export interface RecordingCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#RecordingCallFeature.isRecordingActive}.
   */
  isRecordingActive: boolean;
  /* @conditional-compile-remove(local-recording-notification) */
  /**
   * Contains list of information of started recordings
   * Proxy of {@link @azure/communication-calling#RecordingCallFeature.recordings}.
   */
  activeRecordings?: RecordingInfo[];
  /* @conditional-compile-remove(local-recording-notification) */
  /**
   * Contains list of information of stopped recordings
   */
  lastStoppedRecording?: RecordingInfo[];
}

/* @conditional-compile-remove(local-recording-notification) */
/**
 * State only version of {@link @azure/communication-calling#LocalRecordingCallFeature}. {@link StatefulCallClient} will
 * automatically listen for local recording state of the call and update the state exposed by {@link StatefulCallClient} accordingly.
 *
 * @beta
 */
export interface LocalRecordingCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#LocalRecordingCallFeature.isRecordingActive}.
   */
  isLocalRecordingActive: boolean;
  /**
   * Contains list of information of started recordings
   * Proxy of {@link @azure/communication-calling#LocalRecordingCallFeature.recordings}.
   */
  activeLocalRecordings?: LocalRecordingInfo[];
  /**
   * Contains list of information of stopped recordings
   */
  lastStoppedLocalRecording?: LocalRecordingInfo[];
}

/**
 * State only version of {@link @azure/communication-calling#RaiseHandCallFeature}. {@link StatefulCallClient} will
 * automatically listen for raised hands on the call and update the state exposed by {@link StatefulCallClient} accordingly.
 *
 * @public
 */
export interface RaiseHandCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#RaiseHandCallFeature.raisedHands}.
   */
  raisedHands: RaisedHandState[];
  /**
   * Contains information for local participant from list {@link @azure/communication-calling#RaiseHandCallFeature.raisedHands}.
   */
  localParticipantRaisedHand?: RaisedHandState;
}

/**
 * State only version of {@link @azure/communication-calling#PPTLiveCallFeature}. {@link StatefulCallClient} will
 * automatically listen for pptLive on the call and update the state exposed by {@link StatefulCallClient} accordingly.
 *
 * @public
 */
export interface PPTLiveCallFeatureState {
  /**
   * Proxy of {@link @azure/communication-calling#PPTLiveCallFeature.isActive}.
   */
  isActive: boolean;
}
/**
 * Raised hand state with order
 *
 * @public
 */
export type RaisedHandState = {
  raisedHandOrderPosition: number;
};

/**
 * State only version of {@link @azure/communication-calling#Call.ReactionMessage} with UI helper props receivedOn.
 * Reaction state with a timestamp which helps UI to decide to render the reaction accordingly.
 *
 * @public
 */
export type ReactionState = {
  /**
   * Reaction message from the meeting {@link @azure/communication-calling#Call.ReactionMessage}
   */
  reactionMessage: ReactionMessage;
  /**
   * Received timestamp of the reaction message in a meeting.
   */
  receivedOn: Date;
};

/**
 * State only version of {@link @azure/communication-calling#LocalVideoStream}.
 *
 * @public
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

  /**
   * Stores the state of the video effects.
   * @public
   */
  videoEffects?: LocalVideoStreamVideoEffectsState;
}

/**
 * State only version of a LocalVideoStream's {@link @azure/communication-calling#VideoEffectsFeature}.
 *
 * @public
 */
export interface LocalVideoStreamVideoEffectsState {
  /**
   * List of effects if any are active.
   */
  activeEffects?: VideoEffectName[];
}

/**
 * State only version of Optimal Video Count Feature {@link @azure/communication-calling#OptimalVideoCountCallFeature}.
 *
 * @public
 */
export interface OptimalVideoCountFeatureState {
  /**
   * State of the current optimal video count.
   */
  maxRemoteVideoStreams: number;
}

/**
 * State only version of {@link @azure/communication-calling#RemoteVideoStream}.
 *
 * @public
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
   * Proxy of {@link @azure/communication-calling#RemoteVideoStream.isReceiving}.
   * @public
   */
  isReceiving: boolean;
  /**
   * {@link VideoStreamRendererView} that is managed by createView/disposeView in {@link StatefulCallClient}
   * API. This can be undefined if the stream has not yet been rendered and defined after createView creates the view.
   */
  view?: VideoStreamRendererViewState;
  /**
   * Proxy of {@link @azure/communication-calling#RemoteVideoStream.size}.
   */
  streamSize?: { width: number; height: number };
}

/**
 * State only version of {@link @azure/communication-calling#VideoStreamRendererView}. This property is added to the state exposed
 * by {@link StatefulCallClient} by {@link StatefulCallClient.createView} and removed by {@link StatefulCallClient.disposeView}.
 *
 * @public
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
 *
 * @public
 */
export interface RemoteParticipantState {
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.identifier}.
   */
  identifier: CommunicationIdentifierKind;
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
  /**
   * Proxy of {@link @azure/communication-calling#RemoteParticipant.role}.
   */
  role?: ParticipantRole;
  /**
   * Proxy of {@link @azure/communication-calling#Call.RaisedHand.raisedHands}.
   */
  raisedHand?: RaisedHandState;
  /**
   * Proxy of {@link @azure/communication-calling#Call.PPTLive.target}.
   *
   * @public
   */
  contentSharingStream?: HTMLElement;
  /**
   * Proxy of {@link @azure/communication-calling#Call.ReactionMessage} with
   * UI helper props receivedOn which indicates the timestamp when the message was received.
   *
   * @public
   */
  reactionState?: ReactionState;
  /**
   * Proxy of {@link @azure/communication-calling#SpotlightCallFeature.spotlightedParticipants}.
   */
  spotlight?: SpotlightState;
  /* @conditional-compile-remove(remote-ufd) */
  /**
   * The diagnostic status of RemoteParticipant{@link @azure/communication-calling#RemoteDiagnostics}.
   */
  diagnostics?: Record<string, RemoteDiagnosticState>;
}

/**
 * State only version of {@link @azure/communication-calling#Call}. {@link StatefulCallClient} will automatically
 * retrieve Call's state and add it to the state exposed by {@link StatefulCallClient}.
 *
 * @public
 */
export interface CallState {
  /**
   * Proxy of {@link @azure/communication-calling#Call.id}.
   */
  id: string;
  /* @conditional-compile-remove(teams-identity-support) */
  /**
   * Type of the call.
   */
  kind: CallKind;
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
   * Proxy of {@link @azure/communication-calling#TranscriptionCallFeature}.
   */
  captionsFeature: CaptionsCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#OptimalVideoCountCallFeature}.
   */
  optimalVideoCount: OptimalVideoCountFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#RecordingCallFeature}.
   */
  recording: RecordingCallFeatureState;
  /* @conditional-compile-remove(local-recording-notification) */
  /**
   * Proxy of {@link @azure/communication-calling#LocalRecordingCallFeature}.
   */
  localRecording: LocalRecordingCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#PPTLiveCallFeature}.
   *
   *@public
   */
  pptLive: PPTLiveCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#RaiseHandCallFeature}.
   */
  raiseHand: RaiseHandCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#Call.ReactionMessage} with
   * UI helper props receivedOn which indicates the timestamp when the message was received.
   *
   * @public
   */
  localParticipantReaction?: ReactionState;
  /**
   * Stores the currently active screenshare participant's key. If there is no screenshare active, then this will be
   * undefined. You can use this key to access the remoteParticipant data in {@link CallState.remoteParticipants} object.
   *
   * Note this only applies to ScreenShare in RemoteParticipant. A local ScreenShare being active will not affect this
   * property.
   *
   * This property is added by the stateful layer and is not a proxy of SDK state
   */
  screenShareRemoteParticipant?: string;
  /**
   * Stores the currently active pptlive participant's key. Will be reused by White board etc. If there is no screenshare active, then this will be
   * undefined. You can use this key to access the remoteParticipant data in {@link CallState.remoteParticipants} object.
   *
   * Note this only applies to PPTLive in RemoteParticipant.
   *
   * This property is added by the stateful layer and is not a proxy of SDK state
   *
   * @public
   */
  contentSharingRemoteParticipant?: string;
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
  /**
   * Proxy of {@link @azure/communication-calling#Call.role}.
   */
  role?: ParticipantRole;

  /* @conditional-compile-remove(total-participant-count) */
  /**
   * Proxy of {@link @azure/communication-calling#Call.totalParticipantCount}.
   */
  totalParticipantCount?: number;
  /**
   * Transfer state of call
   */
  transfer: TransferFeatureState;

  /**
   * Proxy of {@link @azure/communication-calling#CapabilitiesFeature}.
   */
  capabilitiesFeature?: CapabilitiesFeatureState;
  /**
   * Hide attendee names in teams meeting
   */
  hideAttendeeNames?: boolean;
  /**
   * Proxy of {@link @azure/communication-calling#SpotlightCallFeature}.
   */
  spotlight?: SpotlightCallFeatureState;
  /**
   * Proxy of {@link @azure/communication-calling#Call.info}.
   */
  info?: TeamsCallInfo | /* @conditional-compile-remove(calling-beta-sdk) */ CallInfo;

  /**
   * Proxy of {@link @azure/communication-calling#TeamsMeetingAudioConferencingCallFeature}.
   */
  meetingConference?: { conferencePhones: ConferencePhoneInfo[] };

  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Proxy of {@link @azure/communication-calling#BreakoutRoomsFeature}.
   */
  breakoutRooms?: BreakoutRoomsState;
}

/**
 * Transfer feature state
 *
 * @public
 */
export interface TransferFeatureState {
  /**
   * Accepted transfer requests
   */
  acceptedTransfers: { [key: string]: AcceptedTransfer };
}

/**
 * Transfer feature state
 *
 * @public
 */
export interface AcceptedTransfer {
  /**
   * Stores call id of accepted transfer
   */
  callId: string;
  /**
   * Stores timestamp when transfer was accepted
   */
  timestamp: Date;
}

/**
 * State to track the types {@link CallInfo} and {@link TeamsCallInfo}
 * @public
 */
export interface CallInfoState {
  /**
   * GroupId of the call that you joined
   */
  groupId?: string;
  /**
   * The teams meeting thread id
   */
  threadId?: string;
  /**
   * participant id of the local user
   */
  participantId: string;
  /**
   * Differentiator between the Call and TeamsCall types
   */
  kind: IncomingCallKind;
}

/**
 * State only version of {@link @azure/communication-calling#IncomingCall}. {@link StatefulCallClient} will
 * automatically detect incoming calls and add their state to the state exposed by {@link StatefulCallClient}.
 *
 * @public
 */
export interface IncomingCallState {
  /**
   * Proxy of {@link @azure/communication-calling#IncomingCall.id}.
   */
  id: string;
  /**
   * Proxy of {@link @azure/communication-calling#IncomingCall.callInfo}.
   */
  info: CallInfoState;
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
  endTime?: Date;
}

/**
 * State only version of {@link @azure/communication-calling#TeamsIncomingCall}
 * @public
 */
export interface TeamsIncomingCallState {
  /**
   * Proxy of {@link @azure/communication-calling#TeamsIncomingCall.id}.
   */
  id: string;
  /**
   * Proxy of {@link @azure/communication-calling#TeamsIncomingCall.teamsCallInfo}.
   */
  info: CallInfoState;
  /**
   * Proxy of {@link @azure/communication-calling#TeamsIncomingCall.callerInfo}.
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
  endTime?: Date;
}

/**
 * This type is meant to encapsulate all the state inside {@link @azure/communication-calling#DeviceManager}. For
 * optional parameters they may not be available until permission is granted by the user. The cameras, microphones,
 * speakers, and deviceAccess states will be empty until the corresponding
 * {@link @azure/communication-calling#DeviceManager}'s getCameras, getMicrophones, getSpeakers, and askDevicePermission
 * APIs are called and completed.
 *
 * @public
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
 *
 * @public
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
   * Calls that have ended are stored here so the callEndReason could be checked.
   * It is an object with {@link @azure/communication-calling#Call.id} keys and {@link CallState} values.
   *
   * Only {@link MAX_CALL_HISTORY_LENGTH} Calls are kept in the history. Oldest calls are evicted if required.
   */
  callsEnded: { [key: string]: CallState };
  /**
   * Proxy of {@link @azure/communication-calling#IncomingCall} as an object with {@link IncomingCall} fields.
   * It is keyed by {@link @azure/communication-calling#IncomingCall.id}.
   */
  incomingCalls: {
    [key: string]: IncomingCallState | /* @conditional-compile-remove(one-to-n-calling) */ TeamsIncomingCallState;
  };
  /**
   * Incoming Calls that have ended are stored here so the callEndReason could be checked.
   * It is an as an object with {@link @azure/communication-calling#Call.id} keys and {@link IncomingCall} values.
   *
   * Only {@link MAX_CALL_HISTORY_LENGTH} Calls are kept in the history. Oldest calls are evicted if required.
   */
  incomingCallsEnded: {
    [key: string]: IncomingCallState | /* @conditional-compile-remove(one-to-n-calling) */ TeamsIncomingCallState;
  };
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
  userId: CommunicationIdentifierKind;
  /**
   * Stores the latest error for each API method.
   *
   * See documentation of {@Link CallErrors} for details.
   */
  latestErrors: CallErrors;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Stores the latest notifications.
   *
   * See documentation of {@Link CallNotifications} for details.
   */
  latestNotifications: CallNotifications;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * A phone number in E.164 format that will be used to represent callers identity.
   * For example, using the alternateCallerId to add a participant using PSTN, this number will
   * be used as the caller id in the PSTN call.
   */
  alternateCallerId?: string;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * state to track the environment that the stateful client was made in is supported
   */
  environmentInfo?: EnvironmentInfo;
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
 *
 * @public
 */
export type CallErrors = {
  [target in CallErrorTarget]: CallError;
};

/**
 * Error thrown from failed stateful API methods.
 *
 * @public
 */
export class CallError extends Error {
  /**
   * The API method target that failed.
   */
  public target: CallErrorTarget;
  /**
   * Error thrown by the failed SDK method.
   */
  public innerError: Error;
  /**
   * Timestamp added to the error by the stateful layer.
   */
  public timestamp: Date;

  constructor(target: CallErrorTarget, innerError: Error, timestamp?: Date) {
    super();
    this.target = target;
    this.innerError = innerError;
    // Testing note: It is easier to mock Date::now() than the Date() constructor.
    this.timestamp = timestamp ?? new Date(Date.now());
    this.name = 'CallError';
    this.message = `${this.target}: ${this.innerError.message}`;
  }
}

/**
 * String literal type for all permissible keys in {@Link CallErrors}.
 *
 * @public
 */
export type CallErrorTarget =
  | 'Call.addParticipant'
  | 'Call.dispose'
  | 'Call.feature'
  | 'Call.hangUp'
  | 'Call.hold'
  | 'Call.mute'
  | 'Call.muteIncomingAudio'
  | 'Call.off'
  | 'Call.on'
  | 'Call.removeParticipant'
  | 'Call.resume'
  | 'Call.sendDtmf'
  | 'Call.startAudio'
  | 'Call.startScreenSharing'
  | 'Call.startVideo'
  | 'Call.stopScreenSharing'
  | 'Call.stopAudio'
  | 'Call.stopVideo'
  | 'Call.unmute'
  | 'Call.unmuteIncomingAudio'
  | 'CallAgent.dispose'
  | 'CallAgent.feature'
  | 'CallAgent.join'
  | 'CallAgent.off'
  | 'CallAgent.on'
  | 'CallAgent.startCall'
  | 'CallClient.createCallAgent'
  | 'CallClient.createTeamsCallAgent'
  | 'CallClient.feature'
  | 'CallClient.getDeviceManager'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'CallClient.getEnvironmentInfo'
  | 'DeviceManager.askDevicePermission'
  | 'DeviceManager.getCameras'
  | 'DeviceManager.getMicrophones'
  | 'DeviceManager.getSpeakers'
  | 'DeviceManager.off'
  | 'DeviceManager.on'
  | 'DeviceManager.selectMicrophone'
  | 'DeviceManager.selectSpeaker'
  | 'IncomingCall.accept'
  | 'IncomingCall.reject'
  | /* @conditional-compile-remove(calling-beta-sdk) */ /* @conditional-compile-remove(teams-identity-support) */ 'TeamsCall.addParticipant'
  | 'VideoEffectsFeature.startEffects'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'CallAgent.handlePushNotification'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'Call.admit'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'Call.rejectParticipant'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'Call.admitAll'
  | /* @conditional-compile-remove(soft-mute) */ 'Call.mutedByOthers'
  | 'Call.muteAllRemoteParticipants'
  | 'Call.setConstraints';

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @public
 */
export type CallNotifications = {
  [target in NotificationTarget]: CallNotification;
};

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @public
 */
export interface CallNotification {
  target: NotificationTarget;

  timestamp: Date;
}

/* @conditional-compile-remove(breakout-rooms) */
/** @public */
export type NotificationTarget =
  | 'assignedBreakoutRoomOpened'
  | 'assignedBreakoutRoomOpenedPromptJoin'
  | 'assignedBreakoutRoomChanged'
  | 'breakoutRoomJoined'
  | 'breakoutRoomClosingSoon';

/**
 * State only proxy for {@link @azure/communication-calling#DiagnosticsCallFeature}.
 *
 * @public
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

/* @conditional-compile-remove(remote-ufd) */
/**
 * State only proxy for {@link @azure/communication-calling#DiagnosticsCallFeature}.
 *
 * @beta
 */
export declare type RemoteDiagnosticState = {
  readonly diagnostic: NetworkDiagnosticType | MediaDiagnosticType | ServerDiagnosticType;
  readonly value: DiagnosticQuality | DiagnosticFlag;
  readonly valueType: DiagnosticValueType;
};

/**
 * State only proxy for {@link @azure/communication-calling#NetworkDiagnostics}.
 *
 * @public
 */
export interface NetworkDiagnosticsState {
  latest: LatestNetworkDiagnostics;
}

/**
 * State only proxy for {@link @azure/communication-calling#MediaDiagnostics}.
 *
 * @public
 */
export interface MediaDiagnosticsState {
  latest: LatestMediaDiagnostics;
}

/**
 * @public
 * Information for conference phone info
 */
export interface ConferencePhoneInfo {
  /**
   * Phone number for the conference
   */
  phoneNumber: string;
  /**
   * Conference id for the conference
   */
  conferenceId: string;
  /**
   * Is toll free phone number
   */
  isTollFree: boolean;
  /**
   * phone number country
   */
  country?: string;
  /**
   * phone number city
   */
  city?: string;
}
