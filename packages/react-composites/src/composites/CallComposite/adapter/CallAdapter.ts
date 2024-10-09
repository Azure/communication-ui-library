// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallState, DeviceManagerState } from '@internal/calling-stateful-client';
import { CaptionsInfo } from '@internal/calling-stateful-client';
import type { BackgroundBlurConfig, BackgroundReplacementConfig } from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';
import type { CapabilitiesChangeInfo } from '@azure/communication-calling';
import type { SpotlightedParticipant } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall } from '@azure/communication-calling';
import { TransferEventArgs } from '@azure/communication-calling';
import { StartCaptionsOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import type { BreakoutRoomsUpdatedListener } from '@azure/communication-calling';
import type {
  AudioDeviceInfo,
  VideoDeviceInfo,
  Call,
  PermissionConstraints,
  RemoteParticipant,
  StartCallOptions,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
  PropertyChangedEvent
} from '@azure/communication-calling';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import type {
  CommunicationIdentifierKind,
  MicrosoftTeamsAppIdentifier,
  UnknownIdentifier
} from '@azure/communication-common';

import type { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
import { CommunicationIdentifier } from '@azure/communication-common';
import type { CommunicationUserIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import type { AdapterState, Disposable, AdapterError, AdapterErrors } from '../../common/adapters';
/* @conditional-compile-remove(breakout-rooms) */
import type { AdapterNotifications } from '../../common/adapters';

import { VideoBackgroundEffectsDependency } from '@internal/calling-component-bindings';

import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
import { ReactionResources } from '@internal/react-components';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeStreamViewResult } from '@internal/react-components/dist/dist-esm/types';

/**
 * Major UI screens shown in the {@link CallComposite}.
 *
 * @public
 */
export type CallCompositePage =
  | 'accessDeniedTeamsMeeting'
  | 'call'
  | 'configuration'
  | 'hold'
  | 'joinCallFailedDueToNoNetwork'
  | 'leftCall'
  | 'leaving'
  | 'lobby'
  | 'removedFromCall'
  | /* @conditional-compile-remove(unsupported-browser) */ 'unsupportedEnvironment'
  | 'transferring'
  | 'badRequest';

/**
 * Subset of CallCompositePages that represent an end call state.
 * @private
 */
export const END_CALL_PAGES: CallCompositePage[] = [
  'accessDeniedTeamsMeeting',
  'joinCallFailedDueToNoNetwork',
  'leftCall',
  'removedFromCall',
  /* @conditional-compile-remove(unsupported-browser) */ 'unsupportedEnvironment'
];

/**
 * {@link CommonCallAdapter} state for pure UI purposes.
 *
 * @public
 */
export type CallAdapterUiState = {
  isLocalPreviewMicrophoneEnabled: boolean;
  page: CallCompositePage;
  /* @conditional-compile-remove(unsupported-browser) */
  unsupportedBrowserVersionsAllowed?: boolean;
};

/**
 * Identifier types for initiating a call using the CallAdapter
 * @public
 */
export type StartCallIdentifier =
  | (
      | MicrosoftTeamsAppIdentifier
      | PhoneNumberIdentifier
      | CommunicationUserIdentifier
      | MicrosoftTeamsUserIdentifier
      | UnknownIdentifier
    )
  | /* @conditional-compile-remove(start-call-beta) */ CommunicationIdentifier;

/**
 * {@link CommonCallAdapter} state inferred from Azure Communication Services backend.
 *
 * @public
 */
export type CallAdapterClientState = {
  userId: CommunicationIdentifierKind;
  displayName?: string;
  call?: CallState;
  /**
   * State to track who the original call went out to. will be undefined the call is not a outbound
   * modality. This includes, groupCalls, Rooms calls, and Teams InteropMeetings.
   */
  targetCallees?: CommunicationIdentifier[];
  devices: DeviceManagerState;
  endedCall?: CallState;
  /**
   * State to track whether the call is a teams call.
   */
  isTeamsCall: boolean;
  /**
   * State to track whether the call is a teams meeting.
   */
  isTeamsMeeting: boolean;
  /**
   * State to track whether the call is a rooms call.
   */
  isRoomsCall: boolean;
  /**
   * Latest error encountered for each operation performed via the adapter.
   */
  latestErrors: AdapterErrors;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Latest notifications from call client state.
   */
  latestNotifications: AdapterNotifications;
  /**
   * Azure communications Phone number to make PSTN calls with.
   */
  alternateCallerId?: string;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Environment information about system the adapter is made on
   */
  environmentInfo?: EnvironmentInfo;
  /**
   * State to track whether the local participant's camera is on. To be used when creating a custom
   * control bar with the CallComposite.
   */
  cameraStatus?: 'On' | 'Off';

  /**
   * Default set of background images for background replacement effect.
   */
  videoBackgroundImages?: VideoBackgroundImage[];

  /**
   * Dependency to be injected for video background effect.
   */
  onResolveVideoEffectDependency?: () => Promise<VideoBackgroundEffectsDependency>;
  /* @conditional-compile-remove(DNS) */
  /**
   * Dependency to be injected for deep noise suppression effect.
   * @beta
   */
  onResolveDeepNoiseSuppressionDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
  /* @conditional-compile-remove(DNS) */
  /**
   * State to track whether the noise suppression should be on by default.
   * @beta
   * @default true
   */
  deepNoiseSuppressionOnByDefault?: boolean;
  /* @conditional-compile-remove(DNS) */
  /**
   * State to track whether to hide the noise suppression button.
   * @beta
   * @default false
   */
  hideDeepNoiseSuppressionButton?: boolean;
  /**
   * State to track the selected video background effect.
   */
  selectedVideoBackgroundEffect?: VideoBackgroundEffect;
  /**
   * Call from transfer request accepted by local user
   */
  acceptedTransferCallState?: CallState;
  /**
   * Hide attendee names in teams meeting
   */
  hideAttendeeNames?: boolean;
  /**
   * State to track the sounds to be used in the call.
   */
  sounds?: CallingSounds;
  /**
   * State to track the reactions to be used.
   * @public
   */
  reactions?: ReactionResources;
};

/**
 * {@link CommonCallAdapter} state.
 *
 * @public
 */
export type CallAdapterState = CallAdapterUiState & CallAdapterClientState;

/**
 * Callback for {@link CallAdapterSubscribers} 'participantsJoined' event.
 *
 * @public
 */
export type ParticipantsJoinedListener = (event: { joined: RemoteParticipant[] }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'participantsLeft' event.
 *
 * @public
 */
export type ParticipantsLeftListener = (event: { removed: RemoteParticipant[] }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isMuted' event.
 *
 * @public
 */
export type IsMutedChangedListener = (event: { identifier: CommunicationIdentifierKind; isMuted: boolean }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'callIdChanged' event.
 *
 * @public
 */
export type CallIdChangedListener = (event: { callId: string }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isLocalScreenSharingActiveChanged' event.
 *
 * @public
 */
export type IsLocalScreenSharingActiveChangedListener = (event: { isScreenSharingOn: boolean }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isSpeakingChanged' event.
 *
 * @public
 */
export type IsSpeakingChangedListener = (event: {
  identifier: CommunicationIdentifierKind;
  isSpeaking: boolean;
}) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'displayNameChanged' event.
 *
 * @public
 */
export type DisplayNameChangedListener = (event: {
  participantId: CommunicationIdentifierKind;
  displayName: string;
}) => void;

/**
 * Payload for {@link CallEndedListener} containing details on the ended call.
 *
 * @public
 */
export type CallAdapterCallEndedEvent = { callId: string };

/**
 * Callback for {@link CallAdapterSubscribers} 'callEnded' event.
 *
 * @public
 */
export type CallEndedListener = (event: CallAdapterCallEndedEvent) => void;

/**
 * Payload for {@link DiagnosticChangedEventListner} where there is a change in a media diagnostic.
 *
 * @public
 */
export type MediaDiagnosticChangedEvent = MediaDiagnosticChangedEventArgs & {
  type: 'media';
};

/**
 * Payload for {@link DiagnosticChangedEventListner} where there is a change in a network diagnostic.
 *
 * @public
 */
export type NetworkDiagnosticChangedEvent = NetworkDiagnosticChangedEventArgs & {
  type: 'network';
};

/**
 * Callback for {@link CallAdapterSubscribers} 'diagnosticChanged' event.
 *
 * @public
 */
export type DiagnosticChangedEventListner = (
  event: MediaDiagnosticChangedEvent | NetworkDiagnosticChangedEvent
) => void;

/**
 * Contains the attibutes of a background image like url, name etc.
 *
 * @public
 */
export interface VideoBackgroundImage {
  /**
   * key for unique identification of the custom background
   */
  key: string;
  /**
   * URL of the uploaded background image.
   */
  url: string;
  /**
   * Image name to be displayed.
   */
  tooltipText?: string;
}

/**
 * @public
 * Type for representing a custom sound to use for a calling event
 */
export type SoundEffect = {
  /**
   * Path to sound effect
   */
  url: string;
};

/**
 * @public
 * Type for representing a set of sounds to use for different calling events
 */
export type CallingSounds = {
  /**
   * Sound to be played when the call ends
   */
  callEnded?: SoundEffect;
  /**
   * Sound to be played when the call is ringing
   */
  callRinging?: SoundEffect;
  /**
   * Sound to be played when the call is rejected by the user being callede
   */
  callBusy?: SoundEffect;
};

/**
 * Options for setting microphone and camera state when joining a call
 * true = turn on the device when joining call
 * false = turn off the device when joining call
 * 'keep'/undefined = retain devices' precall state
 *
 * @public
 */
export interface JoinCallOptions {
  /**
   * microphone state when joining call
   * true: turn on
   * false: turn off
   * 'keep': maintain precall state
   */
  microphoneOn?: boolean | 'keep';
  /**
   * camera state when joining call
   * true: turn on
   * false: turn off
   * 'keep': maintain precall state
   */
  cameraOn?: boolean | 'keep';
}

/**
 * Callback for {@link CallAdapterSubscribers} 'captionsReceived' event.
 *
 * @public
 */
export type CaptionsReceivedListener = (event: { captionsInfo: CaptionsInfo }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isCaptionsActiveChanged' event.
 *
 * @public
 */
export type IsCaptionsActiveChangedListener = (event: { isActive: boolean }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isCaptionLanguageChanged' event.
 *
 * @public
 */
export type IsCaptionLanguageChangedListener = (event: { activeCaptionLanguage: string }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isSpokenLanguageChanged' event.
 *
 * @public
 */
export type IsSpokenLanguageChangedListener = (event: { activeSpokenLanguage: string }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'transferRequested' event.
 *
 * @public
 */
export type TransferAcceptedListener = (event: TransferEventArgs) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'capabilitiesChanged' event.
 *
 * @public
 */
export type CapabilitiesChangedListener = (data: CapabilitiesChangeInfo) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'spotlightChanged' event.
 *
 * @public
 */
export type SpotlightChangedListener = (args: {
  added: SpotlightedParticipant[];
  removed: SpotlightedParticipant[];
}) => void;

/**
 * Contains the attibutes of a selected video background effect
 *
 * @public
 */
export type VideoBackgroundEffect =
  | VideoBackgroundNoEffect
  | VideoBackgroundBlurEffect
  | VideoBackgroundReplacementEffect;

/**
 * Contains the attibutes to remove video background effect
 *
 * @public
 */
export interface VideoBackgroundNoEffect {
  /**
   * Name of effect to remove video background effect
   */
  effectName: 'none';
}

/**
 * Contains the attibutes of the blur video background effect
 *
 * @public
 */
export interface VideoBackgroundBlurEffect extends BackgroundBlurConfig {
  /**
   * Name of effect to blur video background effect
   */
  effectName: 'blur';
}

/**
 * Contains the attibutes of a selected replacement video background effect
 *
 * @public
 */
export interface VideoBackgroundReplacementEffect extends BackgroundReplacementConfig {
  /**
   * Name of effect to replace video background effect
   */
  effectName: 'replacement';
  /**
   * key for unique identification of the custom background
   */
  key?: string;
}

/**
 * Options passed to adapter.startCaptions
 *
 * @public
 */
export interface StartCaptionsAdapterOptions extends StartCaptionsOptions {
  /**
   * Start captions in the background without showing the captions UI to the Composite user.
   *
   * @defaultValue false
   */
  startInBackground?: boolean;
}

/**
 * Options passed to adapter.stopCaptions
 *
 * @public
 */
export interface StopCaptionsAdapterOptions {
  /**
   * Stop captions that have been started in the background.
   *
   * @remarks
   * This option is only applicable when stopping captions that have been started using the `startInBackground` property of adpater.startCaptions.
   *
   * @defaultValue false
   */
  stopInBackground?: boolean;
}

/**
 * Functionality for managing the current call.
 *
 * @public
 */
export interface CallAdapterCallOperations {
  /**
   * Leave the call
   *
   * @param forEveryone - Whether to remove all participants when leaving
   *
   * @public
   */
  leaveCall(forEveryone?: boolean): Promise<void>;
  /**
   * Start the camera
   * This method will start rendering a local camera view when the call is not active
   *
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  startCamera(options?: VideoStreamOptions): Promise<void>;
  /**
   * Stop the camera
   * This method will stop rendering a local camera view when the call is not active
   *
   * @public
   */
  stopCamera(): Promise<void>;
  /**
   * Mute the current user during the call or disable microphone locally
   *
   * @public
   */
  mute(): Promise<void>;
  /**
   * Unmute the current user during the call or enable microphone locally
   *
   * @public
   */
  unmute(): Promise<void>;
  /**
   * Start sharing the screen during a call.
   *
   * @public
   */
  startScreenShare(): Promise<void>;
  /**
   * Raise hand for current user
   *
   * @public
   */
  raiseHand(): Promise<void>;
  /**
   * lower hand for current user
   *
   * @public
   */
  lowerHand(): Promise<void>;
  /**
   * Send reaction emoji
   *
   * @public
   */
  onReactionClick(reaction: Reaction): Promise<void>;
  /**
   * Stop sharing the screen
   *
   * @public
   */
  stopScreenShare(): Promise<void>;
  /**
   * Remove a participant from the call.
   *
   * @param userId - Id of the participant to be removed
   *
   * @public
   */
  removeParticipant(userId: string): Promise<void>;
  /**
   * Remove a participant from the call.
   * @param participant - {@link @azure/communication-common#CommunicationIdentifier} of the participant to be removed
   * @public
   */
  removeParticipant(participant: CommunicationIdentifier): Promise<void>;
  /**
   * Create the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite
   *
   * @param remoteUserId - Id of the participant to render, leave it undefined to create the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void | CreateVideoStreamViewResult>;
  /**
   * Dispose the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite
   *
   * @deprecated Use {@link disposeRemoteVideoStreamView}, {@link disposeLocalVideoStreamView} and {@link disposeRemoteVideoStreamView} instead.
   *
   * @param remoteUserId - Id of the participant to render, leave it undefined to dispose the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
  /* @conditional-compile-remove(together-mode) */
  /**
   * Create the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite
   *
   * @param featureName - Name of feature to render
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @beta
   */
  createTogetherModeStreamViews(options?: VideoStreamOptions): Promise<void | TogetherModeStreamViewResult>;

  /* @conditional-compile-remove(together-mode) */
  /**
   * Dispose the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite
   *
   *
   * @param featureName - Name of the feature to dispose
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @beta
   */
  disposeTogetherModeStreamViews(options?: VideoStreamOptions): Promise<void>;
  /**
   * Dispose the html view for a screen share stream
   *
   * @remarks
   * this method is implemented for composite
   *
   * @param remoteUserId - Id of the participant to dispose the screen share stream view for.
   *
   * @public
   */
  disposeScreenShareStreamView(remoteUserId: string): Promise<void>;
  /**
   * Dispose the html view for a remote video stream
   *
   * @param remoteUserId - Id of the participant to dispose
   *
   * @public
   */
  disposeRemoteVideoStreamView(remoteUserId: string): Promise<void>;
  /**
   * Dispose the html view for a local video stream
   *
   * @public
   */
  disposeLocalVideoStreamView(): Promise<void>;
  /**
   * Holds the call.
   *
   * @public
   */
  holdCall(): Promise<void>;
  /**
   * Resumes the call from a `LocalHold` state.
   *
   * @public
   */
  resumeCall(): Promise<void>;
  /**
   * Add a participant to the call.
   *
   * @public
   */
  addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;
  addParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /**
   * send dtmf tone to another participant in a 1:1 PSTN call
   *
   * @public
   */
  sendDtmfTone(dtmfTone: DtmfTone): Promise<void>;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Continues into a call when the browser version is not supported.
   */
  allowUnsupportedBrowserVersion(): void;
  /**
   * Function to Start captions
   * @param options - options for start captions
   */
  startCaptions(options?: StartCaptionsAdapterOptions): Promise<void>;
  /**
   * Function to set caption language
   * @param language - language set for caption
   */
  setCaptionLanguage(language: string): Promise<void>;
  /**
   * Function to set spoken language
   * @param language - spoken language
   */
  setSpokenLanguage(language: string): Promise<void>;
  /**
   * Funtion to stop captions
   */
  stopCaptions(options?: StopCaptionsAdapterOptions): Promise<void>;

  /**
   * Start the video background effect.
   *
   * @public
   */
  startVideoBackgroundEffect(videoBackgroundEffect: VideoBackgroundEffect): Promise<void>;

  /**
   * Stop the video background effect.
   *
   * @public
   */
  stopVideoBackgroundEffects(): Promise<void>;

  /**
   * Override the background picker images for background replacement effect.
   *
   * @param backgroundImages - Array of custom background images.
   *
   * @public
   */
  updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void;

  /**
   * Update the selected video background effect.
   *
   * @public
   */
  updateSelectedVideoBackgroundEffect(selectedVideoBackground: VideoBackgroundEffect): void;
  /* @conditional-compile-remove(DNS) */
  /**
   * Start the noise suppression effect.
   *
   * @beta
   */
  startNoiseSuppressionEffect(): Promise<void>;
  /* @conditional-compile-remove(DNS) */
  /**
   * Stop the noise suppression effect.
   *
   * @beta
   */
  stopNoiseSuppressionEffect(): Promise<void>;
  /**
   * Send the end of call survey result
   *
   * @public
   */
  submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined>;
  /**
   * Start spotlight for local and remote participants by their user ids.
   * If no array of user ids is passed then action is performed on local participant.
   */
  startSpotlight(userIds?: string[]): Promise<void>;
  /**
   * Stop spotlight for local and remote participants by their user ids.
   * If no array of user ids is passed then action is performed on local participant.
   */
  stopSpotlight(userIds?: string[]): Promise<void>;
  /**
   * Stop all spotlights
   */
  stopAllSpotlight(): Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Mute a participant
   *
   * @param userId - Id of the participant to mute
   */
  muteParticipant(userId: string): Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Mute All participants
   */
  muteAllRemoteParticipants(): Promise<void>;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Return to origin call of breakout room
   */
  returnFromBreakoutRoom(): Promise<void>;
}

/**
 * Functionality for managing devices within a call.
 *
 * @public
 */
export interface CallAdapterDeviceManagement {
  /**
   * Ask for permissions of devices.
   *
   * @remarks
   * Browser permission window will pop up if permissions are not granted yet
   *
   * @param constrain - Define constraints for accessing local devices {@link @azure/communication-calling#PermissionConstraints }
   *
   * @public
   */
  askDevicePermission(constrain: PermissionConstraints): Promise<void>;
  /**
   * Query for available camera devices.
   *
   * @remarks
   * This method should be called after askDevicePermission()
   *
   * @return An array of video device information entities {@link @azure/communication-calling#VideoDeviceInfo }
   *
   * @public
   */
  queryCameras(): Promise<VideoDeviceInfo[]>;
  /**
   * Query for available microphone devices.
   *
   * @remarks
   * This method should be called after askDevicePermission()
   *
   * @return An array of audio device information entities {@link @azure/communication-calling#AudioDeviceInfo }
   *
   * @public
   */
  queryMicrophones(): Promise<AudioDeviceInfo[]>;
  /**
   * Query for available speaker devices.
   *
   * @remarks
   * This method should be called after askDevicePermission()
   *
   * @return An array of audio device information entities {@link @azure/communication-calling#AudioDeviceInfo }
   *
   * @public
   */
  querySpeakers(): Promise<AudioDeviceInfo[]>;
  /**
   * Set the camera to use in the call.
   *
   * @param sourceInfo - Camera device to choose, pick one returned by  {@link CallAdapterDeviceManagement#queryCameras }
   * @param options - Options to control how the camera stream is rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  setCamera(sourceInfo: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void>;
  /**
   * Set the microphone to use in the call.
   *
   * @param sourceInfo - Microphone device to choose, pick one returned by {@link CallAdapterDeviceManagement#queryMicrophones }
   *
   * @public
   */
  setMicrophone(sourceInfo: AudioDeviceInfo): Promise<void>;
  /**
   * Set the speaker to use in the call.
   *
   * @param sourceInfo - Speaker device to choose, pick one returned by {@link CallAdapterDeviceManagement#querySpeakers }
   *
   * @public
   */
  setSpeaker(sourceInfo: AudioDeviceInfo): Promise<void>;
}

/**
 * Call composite events that can be subscribed to.
 *
 * @public
 */
export interface CallAdapterSubscribers {
  /**
   * Subscribe function for 'participantsJoined' event.
   */
  on(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  /**
   * Subscribe function for 'participantsLeft' event.
   */
  on(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  /**
   * Subscribe function for 'isMutedChanged' event.
   *
   * @remarks
   * The event will be triggered whenever current user or remote user mute state changed
   *
   */
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  /**
   * Subscribe function for 'callIdChanged' event.
   *
   * @remarks
   * The event will be triggered when callId of current user changed.
   *
   */
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  /**
   * Subscribe function for 'isLocalScreenSharingActiveChanged' event.
   */
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  /**
   * Subscribe function for 'displayNameChanged' event.
   */
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  /**
   * Subscribe function for 'isSpeakingChanged' event.
   */
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  /**
   * Subscribe function for 'callEnded' event.
   */
  on(event: 'callEnded', listener: CallEndedListener): void;
  /**
   * Subscribe function for 'diagnosticChanged' event.
   *
   * This event fires whenever there is a change in user facing diagnostics about the ongoing call.
   */
  on(event: 'diagnosticChanged', listener: DiagnosticChangedEventListner): void;
  /**
   * Subscribe function for 'selectedMicrophoneChanged' event.
   *
   * This event fires whenever the user selects a new microphone device.
   */
  on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for 'selectedSpeakerChanged' event.
   *
   * This event fires whenever the user selects a new speaker device.
   */
  on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for 'error' event.
   */
  on(event: 'error', listener: (e: AdapterError) => void): void;
  /**
   * Subscribe function for 'captionsReceived' event.
   */
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /**
   * Subscribe function for 'isCaptionsActiveChanged' event.
   */
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;

  /**
   * Subscribe function for 'isCaptionLanguageChanged' event.
   */
  on(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;

  /**
   * Subscribe function for 'isSpokenLanguageChanged' event.
   */
  on(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;

  /**
   * Subscribe function for 'transferRequested' event.
   */
  on(event: 'transferAccepted', listener: TransferAcceptedListener): void;

  /**
   * Subscribe function for 'capabilitiesChanged' event.
   */
  on(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  /**
   * Subscribe function for 'roleChanged' event.
   */
  on(event: 'roleChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for 'spotlightChanged' event.
   */
  on(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Subscribe function for 'mutedByOthers' event.
   */
  on(event: 'mutedByOthers', listener: PropertyChangedEvent): void;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Subscribe function for 'breakoutRoomsUpdated' event.
   */
  on(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;
  /**
   * Unsubscribe function for 'participantsJoined' event.
   */
  off(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  /**
   * Unsubscribe function for 'participantsLeft' event.
   */
  off(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  /**
   * Unsubscribe function for 'isMutedChanged' event.
   */
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  /**
   * Unsubscribe function for 'callIdChanged' event.
   */
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  /**
   * Unsubscribe function for 'isLocalScreenSharingActiveChanged' event.
   */
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  /**
   * Unsubscribe function for 'displayNameChanged' event.
   */
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  /**
   * Unsubscribe function for 'isSpeakingChanged' event.
   */
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  /**
   * Unsubscribe function for 'callEnded' event.
   */
  off(event: 'callEnded', listener: CallEndedListener): void;
  /**
   * Unsubscribe function for 'diagnosticChanged' event.
   */
  off(event: 'diagnosticChanged', listener: DiagnosticChangedEventListner): void;
  /**
   * Unsubscribe function for 'selectedMicrophoneChanged' event.
   */
  off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for 'selectedSpeakerChanged' event.
   */
  off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for 'error' event.
   */
  off(event: 'error', listener: (e: AdapterError) => void): void;
  /**
   * Unsubscribe function for 'captionsReceived' event.
   */
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /**
   * Unsubscribe function for 'isCaptionsActiveChanged' event.
   */
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /**
   * Unsubscribe function for 'isCaptionLanguageChanged' event.
   */
  off(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  /**
   * Unsubscribe function for 'isSpokenLanguageChanged' event.
   */
  off(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;
  /**
   * Unsubscribe function for 'transferRequested' event.
   */
  off(event: 'transferAccepted', listener: TransferAcceptedListener): void;

  /**
   * Unsubscribe function for 'capabilitiesChanged' event.
   */
  off(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  /**
   * Unsubscribe function for 'roleChanged' event.
   */
  off(event: 'roleChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for 'spotlightChanged' event.
   */
  off(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Unsubscribe function for 'mutedByOthers' event.
   */
  off(event: 'mutedByOthers', listener: PropertyChangedEvent): void;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Unsubscribe function for 'breakoutRoomsUpdated' event.
   */
  off(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;
}

// This type remains for non-breaking change reason
/**
 * Functionality for managing the current call or start a new call
 * @deprecated CallAdapter interface will be flatten, consider using CallAdapter directly
 * @public
 */
export interface CallAdapterCallManagement extends CallAdapterCallOperations {
  /**
   * Join the call with microphone initially on/off.
   * @deprecated Use joinCall(options?:JoinCallOptions) instead.
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): Call | undefined;

  /**
   * Join the call with options bag to set microphone/camera initial state when joining call
   * true = turn on the device when joining call
   * false = turn off the device when joining call
   * 'keep'/undefined = retain devices' precall state
   *
   * @param options - param to set microphone/camera initially on/off/use precall state.
   *
   * @public
   */
  joinCall(options?: JoinCallOptions): Call | undefined;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): Call | undefined;
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @public
   */
  startCall(participants: StartCallIdentifier[], options?: StartCallOptions): Call | undefined;
}

// TODO: Flatten the adapter structure
/**
 * {@link CallComposite} Adapter interface.
 *
 * @public
 */
export interface CommonCallAdapter
  extends AdapterState<CallAdapterState>,
    Disposable,
    CallAdapterCallOperations,
    CallAdapterDeviceManagement,
    CallAdapterSubscribers {
  /**
   * Join the call with microphone initially on/off.
   * @deprecated Use joinCall(options?:JoinCallOptions) instead.
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): void;
  /**
   * Join the call with options bag to set microphone/camera initial state when joining call
   * true = turn on the device when joining call
   * false = turn off the device when joining call
   * 'keep'/undefined = retain devices' precall state
   *
   * @param options - param to set microphone/camera initially on/off/use precall state.
   *
   * @public
   */
  joinCall(options?: JoinCallOptions): void;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): void;
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @public
   */
  startCall(participants: StartCallIdentifier[], options?: StartCallOptions): void;
}

/**
 *  An Adapter interface specific for Azure Communication identity which extends {@link CommonCallAdapter}.
 *
 * @public
 */
export interface CallAdapter extends CommonCallAdapter {
  /**
   * Join the call with microphone initially on/off.
   * @deprecated Use joinCall(options?:JoinCallOptions) instead.
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): Call | undefined;

  /**
   * Join the call with options bag to set microphone/camera initial state when joining call
   * true = turn on the device when joining call
   * false = turn off the device when joining call
   * 'keep'/undefined = retain devices' precall state
   *
   * @param options - param to set microphone/camera initially on/off/use precall state.
   *
   * @public
   */
  joinCall(options?: JoinCallOptions): Call | undefined;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): Call | undefined;
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @public
   */
  startCall(participants: StartCallIdentifier[], options?: StartCallOptions): Call | undefined;
}

/* @conditional-compile-remove(teams-identity-support) */
/**
 * An Adapter interface specific for Teams identity which extends {@link CommonCallAdapter}.
 *
 * @public
 */
export interface TeamsCallAdapter extends CommonCallAdapter {
  /**
   * Join the call with microphone initially on/off.
   * @deprecated Use joinCall(options?:JoinCallOptions) instead.
   * @param microphoneOn - Whether microphone is initially enabled
   */
  joinCall(microphoneOn?: boolean): TeamsCall | undefined;
  /**
   * Join the call with options bag to set microphone/camera initial state when joining call
   * true = turn on the device when joining call
   * false = turn off the device when joining call
   * 'keep'/undefined = retain devices' precall state
   *
   * @param options - param to set microphone/camera initially on/off.
   *
   * @public
   */
  joinCall(options?: JoinCallOptions): TeamsCall | undefined;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): TeamsCall | undefined;
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @public
   */
  startCall(participants: StartCallIdentifier[], options?: StartCallOptions): TeamsCall | undefined;
}
