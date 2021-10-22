// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';
import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import { CallControlOptions } from '../components/CallControls';
import { CallState as CallStatus } from '@azure/communication-calling';
import { CallState } from '@internal/calling-stateful-client';

const CALL_ENDED_CODE = 0;
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

const isInLobbyOrConnecting = (callStatus: CallStatus | undefined): boolean =>
  ['Connecting', 'Ringing', 'InLobby'].includes(callStatus ?? 'None');

const isCallEnded = (endedCall: CallState): boolean => endedCall.callEndReason?.code === CALL_ENDED_CODE;

enum CallEndReasons {
  LEFT_CALL,
  ACCESS_DENIED,
  REMOVED_FROM_CALL
}

const getCallEndReason = (callEndedState: CallState): CallEndReasons => {
  if (
    callEndedState.callEndReason?.subCode &&
    callEndedState.callEndReason.subCode === ACCESS_DENIED_TEAMS_MEETING_SUB_CODE
  ) {
    return CallEndReasons.ACCESS_DENIED;
  }

  if (
    callEndedState.callEndReason?.subCode &&
    REMOVED_FROM_CALL_SUB_CODES.includes(callEndedState.callEndReason.subCode)
  ) {
    return CallEndReasons.REMOVED_FROM_CALL;
  }

  // No error codes match, assume the user simply left the call regularly
  return CallEndReasons.LEFT_CALL;
};

/**
 * Get the current call composite page based on the current call composite state
 *
 * @private
 */
export const getCallCompositePage = (callStatus: CallStatus, callEndedState?: CallState): CallCompositePage => {
  if (isInLobbyOrConnecting(callStatus)) {
    return 'lobby';
  }

  if (_isInCall(callStatus)) {
    return 'call';
  }

  if (callEndedState && isCallEnded(callEndedState)) {
    const reason = getCallEndReason(callEndedState);
    switch (reason) {
      case CallEndReasons.ACCESS_DENIED:
        return 'accessDeniedTeamsMeeting';
      case CallEndReasons.REMOVED_FROM_CALL:
        return 'removedFromCall';
      case CallEndReasons.LEFT_CALL:
        // @TODO update this to 'leftPage' when the left call page is implemented
        return 'configuration';
    }
  }

  // Default to the configuration page
  return 'configuration';
};
