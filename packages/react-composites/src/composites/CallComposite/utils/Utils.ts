// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapterState, CallCompositePage, END_CALL_PAGES } from '../adapter/CallAdapter';
import { _isInCall, _isPreviewOn, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { CallControlOptions } from '../types/CallControlOptions';
import { CallState } from '@internal/calling-stateful-client';

const ACCESS_DENIED_TEAMS_MEETING_SUB_CODE = 5854;
const REMOVED_FROM_CALL_SUB_CODES = [5000, 5300];

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
  REMOVED_FROM_CALL
}

const getCallEndReason = (call: CallState): CallEndReasons => {
  if (call.callEndReason?.subCode && call.callEndReason.subCode === ACCESS_DENIED_TEAMS_MEETING_SUB_CODE) {
    return CallEndReasons.ACCESS_DENIED;
  }

  if (call.callEndReason?.subCode && REMOVED_FROM_CALL_SUB_CODES.includes(call.callEndReason.subCode)) {
    return CallEndReasons.REMOVED_FROM_CALL;
  }

  if (call.callEndReason) {
    // No error codes match, assume the user simply left the call regularly
    return CallEndReasons.LEFT_CALL;
  }

  throw new Error('No matching call end reason');
};

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
export const getCallCompositePage = (
  call: CallState | undefined,
  previousCall: CallState | undefined
): CallCompositePage => {
  // Must check for ongoing call *before* looking at any previous calls.
  // If the composite completes one call and joins another, the previous calls
  // will be populated, but not relevant for determining the page.
  if (call) {
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
  let newOptions = (callControlOptions instanceof Object ? { ...callControlOptions } : callControlOptions) ?? {};
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
