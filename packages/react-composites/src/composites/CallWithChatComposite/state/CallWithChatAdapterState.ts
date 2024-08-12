// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CallState, DeviceManagerState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { CallAdapter, CallAdapterState, CallCompositePage } from '../../CallComposite';

import { VideoBackgroundImage, VideoBackgroundEffect } from '../../CallComposite';

import { VideoBackgroundEffectsDependency } from '@internal/calling-component-bindings';
import { ChatAdapterState } from '../../ChatComposite';
import { AdapterErrors } from '../../common/adapters';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
import { ReactionResources } from '@internal/react-components';

/**
 * UI state pertaining to the {@link CallWithChatComposite}.
 *
 * @public
 */
export interface CallWithChatAdapterUiState {
  /**
   * Microphone state before a call has joined.
   *
   * @public
   */
  isLocalPreviewMicrophoneEnabled: boolean;
  /**
   * Current page of the Composite.
   *
   * @public
   */
  page: CallCompositePage;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * State to track whether the end user has opted in to using a
   * out of date version of a supported browser. Allows the user
   * to start a call in this state.
   *
   * @beta
   */
  unsupportedBrowserVersionsAllowed?: boolean;
}

/**
 * State from the backend services that drives {@link CallWithChatComposite}.
 *
 * @public
 */
export interface CallWithChatClientState {
  /** ID of the call participant using this CallWithChatAdapter. */
  userId: CommunicationIdentifierKind;
  /** Display name of the participant using this CallWithChatAdapter. */
  displayName: string | undefined;
  /** State of the current call. */
  call?: CallState;
  /** State of the current chat. */
  chat?: ChatThreadClientState;
  /** Latest call error encountered for each operation performed via the adapter. */
  latestCallErrors: AdapterErrors;
  /** Latest chat error encountered for each operation performed via the adapter. */
  latestChatErrors: AdapterErrors;
  /** State of available and currently selected devices */
  devices: DeviceManagerState;
  /** State of whether the active call is a Teams interop call */
  isTeamsCall: boolean;
  /** State of whether the active call is a Teams interop meeting */
  isTeamsMeeting: boolean;
  /* @conditional-compile-remove(PSTN-calls) */
  /** alternateCallerId for PSTN call */
  alternateCallerId?: string | undefined;
  /* @conditional-compile-remove(unsupported-browser) */
  /** Environment information for system adapter is made on */
  environmentInfo?: EnvironmentInfo;

  /** Default set of background images for background replacement effect */
  videoBackgroundImages?: VideoBackgroundImage[];

  /** Dependency to be injected for video background effects */
  onResolveVideoEffectDependency?: () => Promise<VideoBackgroundEffectsDependency>;

  /** State to track the selected video background effect */
  selectedVideoBackgroundEffect?: VideoBackgroundEffect;
  /* @conditional-compile-remove(hide-attendee-name) */
  /** Hide attendee names in teams meeting */
  hideAttendeeNames?: boolean;
  /**
   * Reaction resources to render in meetings
   * */
  reactions?: ReactionResources;
  /* @conditional-compile-remove(DNS) */
  /**
   * Parameter to enable deep noise suppression
   * @default true
   */
  enableDeepNoiseSuppression?: boolean;
}

/**
 * CallWithChat State is a combination of Stateful Chat and Stateful Calling clients with some
 * state specific to the CallWithChat Composite only.
 *
 * @public
 */
export interface CallWithChatAdapterState extends CallWithChatAdapterUiState, CallWithChatClientState {}

/**
 * @private
 */
export function callWithChatAdapterStateFromBackingStates(callAdapter: CallAdapter): CallWithChatAdapterState {
  const callAdapterState = callAdapter.getState();

  return {
    call: callAdapterState.call,
    chat: undefined,
    userId: callAdapterState.userId,
    page: callAdapterState.page,
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall,
    isTeamsMeeting: callAdapterState.isTeamsMeeting,
    latestCallErrors: callAdapterState.latestErrors,
    latestChatErrors: {},
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId: callAdapterState.alternateCallerId,
    /* @conditional-compile-remove(unsupported-browser) */
    environmentInfo: callAdapterState.environmentInfo,
    videoBackgroundImages: callAdapterState.videoBackgroundImages,
    onResolveVideoEffectDependency: callAdapterState.onResolveVideoEffectDependency,
    selectedVideoBackgroundEffect: callAdapterState.selectedVideoBackgroundEffect,
    /* @conditional-compile-remove(hide-attendee-name) */
    /** Hide attendee names in teams meeting */
    hideAttendeeNames: callAdapterState.hideAttendeeNames,
    reactions: callAdapterState.reactions
  };
}

/**
 * @private
 */
export function mergeChatAdapterStateIntoCallWithChatAdapterState(
  existingCallWithChatAdapterState: CallWithChatAdapterState,
  chatAdapterState: ChatAdapterState
): CallWithChatAdapterState {
  return {
    ...existingCallWithChatAdapterState,
    chat: chatAdapterState.thread,
    latestChatErrors: chatAdapterState.latestErrors
  };
}

/**
 * @private
 */
export function mergeCallAdapterStateIntoCallWithChatAdapterState(
  existingCallWithChatAdapterState: CallWithChatAdapterState,
  callAdapterState: CallAdapterState
): CallWithChatAdapterState {
  return {
    ...existingCallWithChatAdapterState,
    userId: callAdapterState.userId,
    page: callAdapterState.page,
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    call: callAdapterState.call,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall,
    isTeamsMeeting: callAdapterState.isTeamsMeeting,
    latestCallErrors: callAdapterState.latestErrors,

    videoBackgroundImages: callAdapterState.videoBackgroundImages,

    onResolveVideoEffectDependency: callAdapterState.onResolveVideoEffectDependency,

    selectedVideoBackgroundEffect: callAdapterState.selectedVideoBackgroundEffect
  };
}
