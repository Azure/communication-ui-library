// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAdapterState, CallCompositePage, END_CALL_PAGES, StartCallIdentifier } from '../adapter/CallAdapter';
import { _isInCall, _isPreviewOn, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { CallControlOptions } from '../types/CallControlOptions';
import { CallState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { isPhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(unsupported-browser) */
import { BreakoutRoomSettings, EnvironmentInfo } from '@azure/communication-calling';
import { AdapterStateModifier, CallAdapterLocator } from '../adapter/AzureCommunicationCallAdapter';

import { VideoBackgroundEffectsDependency } from '@internal/calling-component-bindings';

import { VideoBackgroundEffect } from '../adapter/CallAdapter';
import { VideoDeviceInfo } from '@azure/communication-calling';

import { VideoEffectProcessor } from '@azure/communication-calling';
import { CompositeLocale } from '../../localization';
import { CallCompositeIcons } from '../../common/icons';

const ACCESS_DENIED_TEAMS_MEETING_SUB_CODE = 5854;
const REMOTE_PSTN_USER_HUNG_UP = 560000;
const REMOVED_FROM_CALL_SUB_CODES = [5000, 5300, REMOTE_PSTN_USER_HUNG_UP];
const CALL_REJECTED_CODE = 603;
/* @conditional-compile-remove(meeting-id) */
const INVALID_MEETING_IDENTIFIER = 5751;
/** @private */
export const ROOM_NOT_FOUND_SUB_CODE = 5732;
/** @private */
export const ROOM_NOT_VALID_SUB_CODE = 5829;
/** @private */
export const NOT_INVITED_TO_ROOM_SUB_CODE = 5828;
/** @private */
export const INVITE_TO_ROOM_REMOVED_SUB_CODE = 5317;
/** @private */
export const CALL_TIMEOUT_SUB_CODE = 10004;
/** @private */
export const CALL_TIMEOUT_CODE = 487;
/** @private */
export const BOT_TIMEOUT_CODE = 486;
/** @private */
export const BOT_TIMEOUT_SUB_CODE = 10321;

/**
 * @private
 */
export const isCameraOn = (state: CallAdapterState): boolean => {
  if (state.call) {
    const stream = state.call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
    return !!stream;
  } else {
    if (state.devices.selectedCamera) {
      const previewOn = _isPreviewOn(state.devices);
      return previewOn;
    }
  }
  return false;
};

/**
 * Reduce the set of call controls visible on mobile.
 * For example do not show screenshare button.
 *
 * @private
 */
export const reduceCallControlsForMobile = (
  callControlOptions: CallControlOptions | boolean | undefined
): CallControlOptions | false => {
  if (callControlOptions === false) {
    return false;
  }

  // Ensure call controls a valid object.
  const reduceCallControlOptions = callControlOptions === true ? {} : callControlOptions || {};

  // Set to compressed mode when composite is optimized for mobile
  reduceCallControlOptions.displayType = 'compact';

  // Do not show screen share button when composite is optimized for mobile unless the developer
  // has explicitly opted in.
  if (reduceCallControlOptions.screenShareButton !== true) {
    reduceCallControlOptions.screenShareButton = false;
  }

  return reduceCallControlOptions;
};

enum CallEndReasons {
  LEFT_CALL,
  ACCESS_DENIED,
  REMOVED_FROM_CALL,
  BAD_REQUEST
}

const getCallEndReason = (call: CallState): CallEndReasons => {
  const remoteParticipantsEndedArray = Array.from(Object.values(call.remoteParticipantsEnded));
  /**
   * Handle the special case in a PSTN call where removing the last user kicks the caller out of the call.
   * The code and subcode is the same as when a user is removed from a teams interop call.
   * Hence, we look at the last remote participant removed to determine if the last participant removed was a phone number.
   * If yes, the caller was kicked out of the call, but we need to show them that they left the call.
   * Note: This check will only work for 1:1 PSTN Calls. The subcode is different for 1:N PSTN calls, and we do not need to handle that case.
   */
  if (
    remoteParticipantsEndedArray.length === 1 &&
    isPhoneNumberIdentifier(remoteParticipantsEndedArray[0].identifier) &&
    call.callEndReason?.subCode !== REMOTE_PSTN_USER_HUNG_UP
  ) {
    return CallEndReasons.LEFT_CALL;
  }

  if (call.callEndReason?.subCode && call.callEndReason.subCode === ACCESS_DENIED_TEAMS_MEETING_SUB_CODE) {
    return CallEndReasons.ACCESS_DENIED;
  }

  if (call.callEndReason?.subCode && REMOVED_FROM_CALL_SUB_CODES.includes(call.callEndReason.subCode)) {
    return CallEndReasons.REMOVED_FROM_CALL;
  }

  // If the call end reason code is 400, the call is ended due to a bad request. Keep this line at the bottom right before returning normal left call to catch the scenarios not including the ones above.
  if (call.callEndReason?.code === 400) {
    return CallEndReasons.BAD_REQUEST;
  }

  if (call.callEndReason) {
    // No error codes match, assume the user simply left the call regularly
    return CallEndReasons.LEFT_CALL;
  }

  throw new Error('No matching call end reason');
};

/**
 * Helper function for determine strings and icons for end call page
 * @private
 */
export const getEndedCallPageProps = (
  locale: CompositeLocale,
  endedCall?: CallState
): { title: string; moreDetails?: string; disableStartCallButton: boolean; iconName: keyof CallCompositeIcons } => {
  let title = locale.strings.call.leftCallTitle;
  let moreDetails = locale.strings.call.leftCallMoreDetails;
  let disableStartCallButton = false;
  let iconName: keyof CallCompositeIcons = 'NoticePageLeftCall';
  switch (endedCall?.callEndReason?.subCode) {
    case ROOM_NOT_FOUND_SUB_CODE:
      if (locale.strings.call.roomNotFoundTitle) {
        title = locale.strings.call.roomNotFoundTitle;
        moreDetails = locale.strings.call.roomNotFoundDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageRoomNotFound';
      }
      break;
    case ROOM_NOT_VALID_SUB_CODE:
      if (locale.strings.call.roomNotValidTitle) {
        title = locale.strings.call.roomNotValidTitle;
        moreDetails = locale.strings.call.roomNotValidDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageRoomNotValid';
      }
      break;
    case NOT_INVITED_TO_ROOM_SUB_CODE:
      if (locale.strings.call.notInvitedToRoomTitle) {
        title = locale.strings.call.notInvitedToRoomTitle;
        moreDetails = locale.strings.call.notInvitedToRoomDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageNotInvitedToRoom';
      }
      break;
    case INVITE_TO_ROOM_REMOVED_SUB_CODE:
      if (locale.strings.call.inviteToRoomRemovedTitle) {
        title = locale.strings.call.inviteToRoomRemovedTitle;
        moreDetails = locale.strings.call.inviteToRoomRemovedDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageInviteToRoomRemoved';
      }
      break;
    case CALL_TIMEOUT_SUB_CODE:
      if (endedCall?.callEndReason?.code === CALL_TIMEOUT_CODE && locale.strings.call.callTimeoutTitle) {
        title = locale.strings.call.callTimeoutTitle;
        moreDetails = locale.strings.call.callTimeoutDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageCallTimeout';
      }
      break;
    case BOT_TIMEOUT_SUB_CODE:
      if (endedCall?.callEndReason?.code === BOT_TIMEOUT_CODE && locale.strings.call.callTimeoutBotTitle) {
        title = locale.strings.call.callTimeoutBotTitle;
        moreDetails = locale.strings.call.callTimeoutBotDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageCallTimeout';
      }
      break;
  }

  switch (endedCall?.callEndReason?.code) {
    case CALL_REJECTED_CODE:
      if (locale.strings.call.callRejectedTitle) {
        title = locale.strings.call.callRejectedTitle;
        moreDetails = locale.strings.call.callRejectedMoreDetails;
        disableStartCallButton = true;
        iconName = 'NoticePageCallRejected';
      }
      break;
  }
  /* @conditional-compile-remove(teams-adhoc-call) */
  switch (endedCall?.callEndReason?.subCode) {
    case 10037:
      if (locale.strings.call.participantCouldNotBeReachedTitle) {
        title = locale.strings.call.participantCouldNotBeReachedTitle;
        moreDetails = locale.strings.call.participantCouldNotBeReachedMoreDetails;
        disableStartCallButton = true;
      }
      break;
    case 10124:
      if (locale.strings.call.permissionToReachTargetParticipantNotAllowedTitle) {
        title = locale.strings.call.permissionToReachTargetParticipantNotAllowedTitle;
        moreDetails = locale.strings.call.permissionToReachTargetParticipantNotAllowedMoreDetails;
        disableStartCallButton = true;
      }
      break;
    case 10119:
      if (locale.strings.call.unableToResolveTenantTitle) {
        title = locale.strings.call.unableToResolveTenantTitle;
        moreDetails = locale.strings.call.unableToResolveTenantMoreDetails;
        disableStartCallButton = true;
      }
      break;
    case 10044:
      if (locale.strings.call.participantIdIsMalformedTitle) {
        title = locale.strings.call.participantIdIsMalformedTitle;
        moreDetails = locale.strings.call.participantIdIsMalformedMoreDetails;
        disableStartCallButton = true;
      }
      break;
  }
  /* @conditional-compile-remove(meeting-id) */
  switch (endedCall?.callEndReason?.subCode) {
    case INVALID_MEETING_IDENTIFIER:
      if (locale.strings.call.callRejectedTitle) {
        title = locale.strings.call.callRejectedTitle;
        moreDetails = locale.strings.call.invalidMeetingIdentifier;
        disableStartCallButton = true;
      }
      break;
  }
  // keep this at the bottom to catch the scenarios not including the ones above.
  switch (endedCall?.callEndReason?.code) {
    case 400:
      if (locale.strings.call.callRejectedTitle) {
        title = locale.strings.call.callRejectedTitle;
        disableStartCallButton = true;
      }
      break;
  }
  return { title, moreDetails, disableStartCallButton, iconName };
};

/**
 * type definition for conditional-compilation
 */
type GetCallCompositePageFunction = ((
  call: CallState | undefined,
  previousCall: CallState | undefined
) => CallCompositePage) &
  ((
    call: CallState | undefined,
    previousCall: CallState | undefined,
    transferCall?: CallState,
    mainMeeting?: CallState,
    breakoutRoomSettings?: BreakoutRoomSettings,
    /* @conditional-compile-remove(unsupported-browser) */ unsupportedBrowserInfo?: {
      environmentInfo?: EnvironmentInfo;
      unsupportedBrowserVersionOptedIn?: boolean;
    }
  ) => CallCompositePage);
/**
 * Get the current call composite page based on the current call composite state
 *
 * @param Call - The current call state
 * @param previousCall - The state of the most recent previous call that has ended.
 *
 * @remarks - The previousCall state is needed to determine if the call has ended.
 * When the call ends a new call object is created, and so we must lookback at the
 * previous call state to understand how the call has ended. If there is no previous
 * call we know that this is a fresh call and can display the configuration page.
 *
 * @private
 */
export const getCallCompositePage: GetCallCompositePageFunction = (
  call,
  previousCall?,
  transferCall?: CallState,
  mainMeeting?: CallState,
  breakoutRoomSettings?: BreakoutRoomSettings,
  unsupportedBrowserInfo?: {
    /* @conditional-compile-remove(unsupported-browser) */
    environmentInfo?: EnvironmentInfo;
    unsupportedBrowserVersionOptedIn?: boolean;
  }
): CallCompositePage => {
  /* @conditional-compile-remove(unsupported-browser) */
  if (
    isUnsupportedEnvironment(
      unsupportedBrowserInfo?.environmentInfo,
      unsupportedBrowserInfo?.unsupportedBrowserVersionOptedIn
    )
  ) {
    return 'unsupportedEnvironment';
  }

  if (transferCall !== undefined) {
    return 'transferring';
  }

  if (call?.state === 'Disconnecting' && breakoutRoomSettings?.disableReturnToMainMeeting === false) {
    return 'breakoutRoomEnded';
  }
  if (
    mainMeeting?.breakoutRooms?.assignedBreakoutRoom?.state === 'closed' &&
    breakoutRoomSettings?.disableReturnToMainMeeting === false
  ) {
    if (call && mainMeeting?.breakoutRooms?.assignedBreakoutRoom?.call?.id === call.id) {
      return 'breakoutRoomEnded';
    } else if (!call && previousCall && mainMeeting?.breakoutRooms?.assignedBreakoutRoom?.call === undefined) {
      return 'breakoutRoomEnded';
    }
  }

  if (call) {
    // Must check for ongoing call *before* looking at any previous calls.
    // If the composite completes one call and joins another, the previous calls
    // will be populated, but not relevant for determining the page.

    // `_isInLobbyOrConnecting` needs to be checked first because `_isInCall` also returns true when call is in lobby.
    if (_isInLobbyOrConnecting(call?.state)) {
      return 'lobby';
      // `LocalHold` needs to be checked before `isInCall` since it is also a state that's considered in call.
    } else if (call?.state === 'LocalHold') {
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return 'hold';
      return 'call';
    } else if (call?.state === 'Disconnecting') {
      return 'leaving';
    } else if (_isInCall(call?.state)) {
      return 'call';
    } else {
      // When the call object has been constructed after clicking , but before 'connecting' has been
      // set on the call object, we continue to show the configuration screen.
      // The call object does not correctly reflect local device state until `call.state` moves to `connecting`.
      // Moving to the 'lobby' page too soon leads to components that depend on the `call` object to show incorrect
      // transitional state.
      return 'configuration';
    }
  }

  if (previousCall) {
    const reason = getCallEndReason(previousCall);
    switch (reason) {
      case CallEndReasons.ACCESS_DENIED:
        return 'accessDeniedTeamsMeeting';
      case CallEndReasons.REMOVED_FROM_CALL:
        return 'removedFromCall';
      case CallEndReasons.BAD_REQUEST:
        return 'badRequest';
      case CallEndReasons.LEFT_CALL:
        if (previousCall.diagnostics.network.latest.noNetwork) {
          return 'joinCallFailedDueToNoNetwork';
        }
        return 'leftCall';
    }
  }

  // No call state - show starting page (configuration)
  return 'configuration';
};

/** @private */
export const IsCallEndedPage = (
  /**
   * Explicitly listing the pages of this function intentionally.
   * This protects against adding a new composite page that should be marked as an callEndedPage.
   * EndCallPages are used to trigger onCallEnded events so this could easily be missed.
   * When you add a new composite page this will throw a compiler error. If this new page is an
   * EndCallPage ensure you update the END_CALL_PAGES. Afterwards update the `page` parameter
   * type below to allow your new page, i.e. add `| <your new page>
   */
  page: CallCompositePage
): boolean => END_CALL_PAGES.includes(page);

/**
 * Creates a new call control options object and sets the correct values for disabling
 * the buttons provided in the `disabledControls` array.
 * Returns a new object without changing the original object.
 * @param callControlOptions options for the call control component that need to be modified.
 * @param disabledControls An array of controls to disable.
 * @returns a copy of callControlOptions with disabledControls disabled
 * @private
 */
export const disableCallControls = (
  callControlOptions: CallControlOptions | boolean | undefined,
  disabledControls: (keyof CallControlOptions)[]
): CallControlOptions | boolean | undefined => {
  if (callControlOptions === false) {
    return false;
  }
  // Ensure we clone the prop if it is an object to ensure we do not mutate the original prop.
  let newOptions: CallControlOptions | boolean | undefined =
    (callControlOptions instanceof Object ? ({ ...callControlOptions } as CallControlOptions) : callControlOptions) ??
    ({} as Partial<CallControlOptions>);
  if (newOptions === true || newOptions === undefined) {
    newOptions = disabledControls.reduce((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // @ts-expect-error TODO: fix noImplicitAny error here
      // Not solveable at this time due to typescript limitations. The typing is too complex for typescript to
      // understand. Will need to revisit when either typescript or the calling component bindings are updated.
      acc[key] = { disabled: true };
      return acc;
    }, {} as Partial<CallControlOptions>);
  } else {
    disabledControls.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // @ts-expect-error refer to above comment
      if (newOptions[key] !== false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error refer to above comment
        newOptions[key] = { disabled: true };
      }
    });
  }
  return newOptions;
};

/**
 * Check if a disabled object is provided for a button and returns if the button is disabled.
 * A button is only disabled if is explicitly set to disabled.
 *
 * @param option
 * @returns whether a button is disabled
 * @private
 */
export const isDisabled = (option: boolean | { disabled: boolean } | undefined): boolean => {
  if (option === undefined || typeof option === 'boolean') {
    return false;
  }

  return option.disabled;
};

/* @conditional-compile-remove(call-readiness) */
/**
 * @returns Permissions state for the camera.
 */
const queryCameraPermissionFromPermissionsAPI = async (): Promise<PermissionState | 'unsupported'> => {
  try {
    return (await navigator.permissions.query({ name: 'camera' as PermissionName })).state;
  } catch (e) {
    console.info('permissions API is not supported by browser', e);
    return 'unsupported';
  }
};

/* @conditional-compile-remove(call-readiness) */
/**
 * @returns Permissions state for the microphone.
 */
const queryMicrophonePermissionFromPermissionsAPI = async (): Promise<PermissionState | 'unsupported'> => {
  try {
    return (await navigator.permissions.query({ name: 'microphone' as PermissionName })).state;
  } catch (e) {
    console.info('permissions API is not supported by browser', e);
    return 'unsupported';
  }
};

/* @conditional-compile-remove(call-readiness) */
/**
 *
 * This function uses permission API to determine if device permission state is granted, prompt or denied
 * @returns whether device permission state is granted, prompt or denied
 * If permission API is not supported on this browser, permission state is set to unsupported.
 * @private
 */
export const getDevicePermissionState = async (
  setVideoState: (state: PermissionState | 'unsupported') => void,
  setAudioState: (state: PermissionState | 'unsupported') => void
): Promise<void> => {
  const [cameraResult, microphoneResult] = await Promise.all([
    queryCameraPermissionFromPermissionsAPI(),
    queryMicrophonePermissionFromPermissionsAPI()
  ]);
  setVideoState(cameraResult);
  setAudioState(microphoneResult);
};
/* @conditional-compile-remove(unsupported-browser) */
const isUnsupportedEnvironment = (
  environmentInfo?: EnvironmentInfo,
  unsupportedBrowserVersionOptedIn?: boolean
): boolean => {
  return !!(
    environmentInfo?.isSupportedBrowser === false ||
    (environmentInfo?.isSupportedBrowserVersion === false && !unsupportedBrowserVersionOptedIn) ||
    environmentInfo?.isSupportedPlatform === false
  );
};

/**
 * Check if we are using safari browser
 * @private
 */
export const _isSafari = (
  environmentInfo: undefined | /* @conditional-compile-remove(unsupported-browser) */ EnvironmentInfo
): boolean => {
  /* @conditional-compile-remove(unsupported-browser) */
  return environmentInfo?.environment.browser === 'safari';
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
};

/**
 * @private
 * This is the util function to create a participant modifier for remote participantList
 * It memoize previous original participant items and only update the changed participant
 * It takes in one modifier function to generate one single participant object, it returns undefined if the object keeps unmodified
 */
export const createParticipantModifier = (
  createModifiedParticipant: (id: string, participant: RemoteParticipantState) => RemoteParticipantState | undefined
): AdapterStateModifier => {
  let previousParticipantState:
    | {
        [keys: string]: RemoteParticipantState;
      }
    | undefined = undefined;
  let modifiedParticipants: {
    [keys: string]: RemoteParticipantState;
  } = {};
  const memoizedParticipants: {
    [id: string]: { originalRef: RemoteParticipantState; newParticipant: RemoteParticipantState };
  } = {};

  return (state: CallAdapterState) => {
    // if root state is the same, we don't need to update the participants
    if (state.call?.remoteParticipants !== previousParticipantState) {
      modifiedParticipants = {};
      const originalParticipants = state.call?.remoteParticipants;
      for (const key in originalParticipants) {
        const modifiedParticipant = createModifiedParticipant(key, originalParticipants[key]);
        if (modifiedParticipant === undefined) {
          modifiedParticipants[key] = originalParticipants[key];
          continue;
        }
        // Generate the new item if original cached item has been changed
        if (memoizedParticipants[key]?.originalRef !== originalParticipants[key]) {
          memoizedParticipants[key] = {
            newParticipant: modifiedParticipant,
            originalRef: originalParticipants[key]
          };
        }

        // the modified participant is always coming from the memoized cache, whether is was refreshed
        // from the previous closure or not
        modifiedParticipants[key] = memoizedParticipants[key].newParticipant;
      }

      previousParticipantState = state.call?.remoteParticipants;
    }
    return {
      ...state,
      call: state.call
        ? {
            ...state.call,
            remoteParticipants: modifiedParticipants
          }
        : undefined
    };
  };
};

/** @private */
export const getBackgroundEffectFromSelectedEffect = (
  selectedEffect: VideoBackgroundEffect | undefined,
  VideoBackgroundEffectsDependency: VideoBackgroundEffectsDependency
): VideoEffectProcessor | undefined =>
  selectedEffect?.effectName === 'blur'
    ? VideoBackgroundEffectsDependency.createBackgroundBlurEffect()
    : selectedEffect?.effectName === 'replacement'
    ? VideoBackgroundEffectsDependency.createBackgroundReplacementEffect({
        backgroundImageUrl: selectedEffect.backgroundImageUrl
      })
    : undefined;

/**
 * @remarks this logic should mimic the onToggleCamera in the common call handlers.
 * @private
 */
export const getSelectedCameraFromAdapterState = (state: CallAdapterState): VideoDeviceInfo | undefined =>
  state.devices.selectedCamera || state.devices.cameras[0];

/**
 * Helper to determine if the adapter has a locator or targetCallees
 * @param locatorOrTargetCallees
 * @returns boolean to determine if the adapter has a locator or targetCallees, true is locator, false is targetCallees
 * @private
 */
export const getLocatorOrTargetCallees = (
  locatorOrTargetCallees: CallAdapterLocator | StartCallIdentifier[]
): locatorOrTargetCallees is StartCallIdentifier[] => {
  return !!Array.isArray(locatorOrTargetCallees);
};
