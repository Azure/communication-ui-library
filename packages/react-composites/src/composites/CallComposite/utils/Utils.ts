// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';
import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import { CallControlOptions } from '../components/CallControls';
import { CallState as CallStatus } from '@azure/communication-calling';
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

  // Set to compressed mode when composite is optimized for mobile, unless developer has explicitly opted out.
  if (reduceCallControlOptions.compressedMode !== false) {
    reduceCallControlOptions.compressedMode = true;
  }

  // Do not show screen share button when composite is optimized for mobile unless the developer
  // has explicitly opted in.
  if (reduceCallControlOptions.screenShareButton !== true) {
    reduceCallControlOptions.screenShareButton = false;
  }

  return reduceCallControlOptions;
};

const lobbyStatuses: CallStatus[] = ['Connecting', 'Ringing', 'InLobby'];
const isInLobbyOrConnecting = (callStatus: CallStatus | undefined): boolean =>
  !!callStatus && lobbyStatuses.includes(callStatus);

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
  if (!call && !previousCall) {
    // No call state - show starting page (configuration)
    return 'configuration';
  }

  if (previousCall) {
    const reason = getCallEndReason(previousCall);
    switch (reason) {
      case CallEndReasons.ACCESS_DENIED:
        return 'accessDeniedTeamsMeeting';
      case CallEndReasons.REMOVED_FROM_CALL:
        return 'removedFromCall';
      case CallEndReasons.LEFT_CALL:
        // @TODO update this to 'leftPage' when the left call page is implemented
        return 'leftCall';
    }
  }

  if (isInLobbyOrConnecting(call?.state)) {
    return 'lobby';
  }

  if (_isInCall(call?.state)) {
    return 'call';
  }

  // When the call object has been constructed after clicking , but before 'connecting' has been
  // set on the call object, we want to show the connecting screen (which is part of the lobby page currently)
  return 'lobby';
};
