// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, DeviceManagerState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall } from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { BackgroundBlurConfig, BackgroundReplacementConfig } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
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
/* @conditional-compile-remove(rooms) */
import { Role } from '@internal/react-components';
import type { CommunicationIdentifierKind } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions, DtmfTone } from '@azure/communication-calling';

/* @conditional-compile-remove(PSTN-calls) */
import type {
  CommunicationIdentifier,
  CommunicationUserIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import type { AdapterState, Disposable, AdapterError, AdapterErrors } from '../../common/adapters';

/**
 * Major UI screens shown in the {@link CallComposite}.
 *
 * @public
 */
export type CallCompositePage =
  | 'accessDeniedTeamsMeeting'
  | 'call'
  | 'configuration'
  | /* @conditional-compile-remove(PSTN-calls) */ 'hold'
  | 'joinCallFailedDueToNoNetwork'
  | 'leftCall'
  | 'lobby'
  | /* @conditional-compile-remove(rooms) */ 'deniedPermissionToRoom'
  | 'removedFromCall'
  | /* @conditional-compile-remove(rooms) */ 'roomNotFound'
  | /* @conditional-compile-remove(unsupported-browser) */ 'unsupportedEnvironment';

/**
 * Subset of CallCompositePages that represent an end call state.
 * @private
 */
export const END_CALL_PAGES: CallCompositePage[] = [
  'accessDeniedTeamsMeeting',
  'joinCallFailedDueToNoNetwork',
  'leftCall',
  /* @conditional-compile-remove(rooms) */ 'deniedPermissionToRoom',
  'removedFromCall',
  /* @conditional-compile-remove(rooms) */ 'roomNotFound',
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
 * {@link CommonCallAdapter} state inferred from Azure Communication Services backend.
 *
 * @public
 */
export type CallAdapterClientState = {
  userId: CommunicationIdentifierKind;
  displayName?: string;
  call?: CallState;
  devices: DeviceManagerState;
  endedCall?: CallState;
  isTeamsCall: boolean;
  /**
   * Latest error encountered for each operation performed via the adapter.
   */
  latestErrors: AdapterErrors;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Azure communications Phone number to make PSTN calls with.
   */
  alternateCallerId?: string;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Environment information about system the adapter is made on
   */
  environmentInfo?: EnvironmentInfo;
  /* @conditional-compile-remove(rooms) */
  /**
   * Use this to hint the role of the user when the role is not available before a Rooms call is started. This value
   * should be obtained using the Rooms API. This role will determine permissions in the configuration page of the
   * {@link CallComposite}. The true role of the user will be synced with ACS services when a Rooms call starts.
   */
  roleHint?: Role;
  /**
   * State to track whether the local participant's camera is on. To be used when creating a custom
   * control bar with the CallComposite.
   */
  cameraStatus?: 'On' | 'Off';
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Default set of background images for background replacement effect.
   */
  videoBackgroundImages?: VideoBackgroundImage[];
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

/* @conditional-compile-remove(video-background-effects) */
/**
 * Contains the attibutes of a background image like url, name etc.
 *
 * @public
 */
export interface VideoBackgroundImage {
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
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Remove a participant from the call.
   * @param participant - {@link @azure/communication-common#CommunicationIdentifier} of the participant to be removed
   * @beta
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
   * @param remoteUserId - Id of the participant to render, leave it undefined to dispose the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Holds the call.
   *
   * @beta
   */
  holdCall(): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Resumes the call from a `LocalHold` state.
   *
   * @beta
   */
  resumeCall(): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Add a participant to the call.
   *
   * @beta
   */
  addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  addParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * send dtmf tone to another participant in a 1:1 PSTN call
   *
   * @beta
   */
  sendDtmfTone(dtmfTone: DtmfTone): Promise<void>;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Continues into a call when the browser version is not supported.
   */
  allowUnsupportedBrowserVersion(): void;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Start the blur video background effect.
   *
   * @beta
   */
  blurVideoBackground(bgBlurConfig?: BackgroundBlurConfig): Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Start the blur video background effect.
   *
   * @beta
   */
  replaceVideoBackground(bgReplacementConfig: BackgroundReplacementConfig): Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Stop the video background effect.
   *
   * @beta
   */
  stopVideoBackgroundEffect(): Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Set the default background images for background replacement effect.
   *
   * @param backgroundImages - Array of custom background images.
   *
   * @beta
   */
  updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Select the custom background image for background replacement effect and
   * apply if the camera is on.
   *
   * @param backgroundImage - Contains the attibutes of a background image like url, name etc.
   *
   * @beta
   */
  selectCustomBackground(backgroundImage: VideoBackgroundImage): void;
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
   * Query for available microphone devices.
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
   *
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): Call | undefined;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): Call | undefined;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @beta
   */
  startCall(participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined;
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
   *
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): void;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): void;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @beta
   */
  startCall(participants: CommunicationIdentifier[], options?: StartCallOptions): void;
}

/**
 *  An Adapter interface specific for Azure Communication identity which extends {@link CommonCallAdapter}.
 *
 * @public
 */
export interface CallAdapter extends CommonCallAdapter {
  /**
   * Join the call with microphone initially on/off.
   *
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): Call | undefined;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): Call | undefined;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @beta
   */
  startCall(participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined;
}

/* @conditional-compile-remove(teams-identity-support) */
/**
 * An Adapter interface specific for Teams identity which extends {@link CommonCallAdapter}.
 *
 * @beta
 */
export interface TeamsCallAdapter extends CommonCallAdapter {
  /**
   * Join the call with microphone initially on/off.
   *
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @beta
   */
  joinCall(microphoneOn?: boolean): TeamsCall | undefined;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @beta
   */
  startCall(participants: string[], options?: StartCallOptions): TeamsCall | undefined;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @beta
   */
  startCall(participants: CommunicationIdentifier[], options?: StartCallOptions): TeamsCall | undefined;
}
