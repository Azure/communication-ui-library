// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapterState, CallCompositePage, END_CALL_PAGES } from '../adapter/CallAdapter';
/* @conditional-compile-remove(video-background-effects) */
import { CommonCallAdapter } from '../adapter/CallAdapter';
import { _isInCall, _isPreviewOn, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { CallControlOptions } from '../types/CallControlOptions';
import { CallState, RemoteParticipantState } from '@internal/calling-stateful-client';
import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  isUnknownIdentifier
} from '@azure/communication-common';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
import { AdapterStateModifier } from '../adapter/AzureCommunicationCallAdapter';

const ACCESS_DENIED_TEAMS_MEETING_SUB_CODE = 5854;
const REMOTE_PSTN_USER_HUNG_UP = 560000;
const REMOVED_FROM_CALL_SUB_CODES = [5000, 5300, REMOTE_PSTN_USER_HUNG_UP];
/* @conditional-compile-remove(rooms) */
const ROOM_NOT_FOUND_SUB_CODE = 5751;
/* @conditional-compile-remove(rooms) */
const DENIED_PERMISSION_TO_ROOM_SUB_CODE = 5828;

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

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
export const startSelectedVideoEffect = async (adapter: CommonCallAdapter): Promise<void> => {
  if (adapter.getState().selectedVideoBackgroundEffect) {
    const selectedVideoBackgroundEffect = adapter.getState().selectedVideoBackgroundEffect;
    if (selectedVideoBackgroundEffect?.effectKey === 'blur') {
      await adapter.blurVideoBackground();
    } else if (selectedVideoBackgroundEffect?.effectKey === 'none') {
      await adapter.stopVideoBackgroundEffect();
    } else if (selectedVideoBackgroundEffect && 'backgroundImageUrl' in selectedVideoBackgroundEffect) {
      adapter.replaceVideoBackground({ backgroundImageUrl: selectedVideoBackgroundEffect.backgroundImageUrl });
    }
  }
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
  ROOM_NOT_FOUND,
  DENIED_PERMISSION_TO_ROOM
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

  /* @conditional-compile-remove(rooms) */
  if (call.callEndReason?.subCode && call.callEndReason.subCode === ROOM_NOT_FOUND_SUB_CODE) {
    return CallEndReasons.ROOM_NOT_FOUND;
  }

  /* @conditional-compile-remove(rooms) */
  if (call.callEndReason?.subCode && call.callEndReason.subCode === DENIED_PERMISSION_TO_ROOM_SUB_CODE) {
    return CallEndReasons.DENIED_PERMISSION_TO_ROOM;
  }

  if (call.callEndReason) {
    // No error codes match, assume the user simply left the call regularly
    return CallEndReasons.LEFT_CALL;
  }

  throw new Error('No matching call end reason');
};

/**
 * type definition for conditional-compilation
 */
type GetCallCompositePageFunction = ((
  call: CallState | undefined,
  previousCall: CallState | undefined
) => CallCompositePage) &
  /* @conditional-compile-remove(unsupported-browser) */ ((
    call: CallState | undefined,
    previousCall: CallState | undefined,
    unsupportedBrowserInfo?: {
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
  unsupportedBrowserInfo?
): CallCompositePage => {
  /* @conditional-compile-remove(unsupported-browser) */
  if (
    isUnsupportedEnvironment(
      unsupportedBrowserInfo.environmentInfo,
      unsupportedBrowserInfo.unsupportedBrowserVersionOptedIn
    )
  ) {
    return 'unsupportedEnvironment';
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
    /* @conditional-compile-remove(rooms) */
    switch (reason) {
      case CallEndReasons.ROOM_NOT_FOUND:
        return 'roomNotFound';
      case CallEndReasons.DENIED_PERMISSION_TO_ROOM:
        return 'deniedPermissionToRoom';
    }
    switch (reason) {
      case CallEndReasons.ACCESS_DENIED:
        return 'accessDeniedTeamsMeeting';
      case CallEndReasons.REMOVED_FROM_CALL:
        return 'removedFromCall';
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
  page:
    | 'accessDeniedTeamsMeeting'
    | 'call'
    | 'configuration'
    | 'joinCallFailedDueToNoNetwork'
    | 'leftCall'
    | 'lobby'
    | 'removedFromCall'
    | /* @conditional-compile-remove(PSTN-calls) */ 'hold'
    | /* @conditional-compile-remove(rooms) */ 'roomNotFound'
    | /* @conditional-compile-remove(rooms) */ 'deniedPermissionToRoom'
    | /* @conditional-compile-remove(unsupported-browser) */ 'unsupportedEnvironment'
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
  let newOptions =
    (callControlOptions instanceof Object ? ({ ...callControlOptions } as CallControlOptions) : callControlOptions) ??
    {};
  if (newOptions === true || newOptions === undefined) {
    newOptions = disabledControls.reduce((acc, key) => {
      acc[key] = { disabled: true };
      return acc;
    }, {});
  } else {
    disabledControls.forEach((key) => {
      if (newOptions[key] !== false) {
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
 * Check if an object is identifier.
 *
 * @param identifier
 * @returns whether an identifier is one of identifier types (for runtime validation)
 * @private
 */
export const isValidIdentifier = (identifier: CommunicationIdentifier): boolean => {
  return (
    isCommunicationUserIdentifier(identifier) ||
    isPhoneNumberIdentifier(identifier) ||
    isMicrosoftTeamsUserIdentifier(identifier) ||
    isUnknownIdentifier(identifier)
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
  let modifiedParticipants = {};
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
