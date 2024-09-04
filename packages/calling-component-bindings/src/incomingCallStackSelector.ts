// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, IncomingCallState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(one-to-n-calling) */
import { TeamsIncomingCallState } from '@internal/calling-stateful-client';
import { getDeviceManager, getIncomingCalls, getRemovedIncomingCalls } from './baseSelectors';
import { createSelector } from 'reselect';
import { IncomingCallStackCall } from '@internal/react-components';
import { isPhoneNumberIdentifier } from '@azure/communication-common';

/**
 * Selector to get the active and removed incoming calls.
 * @beta
 */
export type IncomingCallStackSelector = (state: CallClientState) => {
  activeIncomingCalls: IncomingCallStackCall[];
  removedIncomingCalls: IncomingCallStackCall[];
};

/**
 * Select the active and removed incoming calls from the stateful client for the IncomingCallNotificationStackComponent.
 * @beta
 */
export const incomingCallStackSelector: IncomingCallStackSelector = createSelector(
  [getIncomingCalls, getRemovedIncomingCalls, getDeviceManager],
  (
    incomingCalls,
    removedIncomingCalls,
    deviceManager
  ): {
    activeIncomingCalls: IncomingCallStackCall[];
    removedIncomingCalls: IncomingCallStackCall[];
  } => {
    // Convert incoming call state to active incoming call
    const componentIncomingCalls = incomingCalls.map(
      (
        incomingCall: IncomingCallState | /* @conditional-compile-remove(one-to-n-calling) */ TeamsIncomingCallState
      ) => {
        return {
          ...incomingCall,
          callerInfo: {
            displayName: incomingCall.callerInfo.displayName || 'Unknown Caller'
          },
          videoAvailable:
            (incomingCall.callerInfo.identifier && isPhoneNumberIdentifier(incomingCall.callerInfo.identifier)) ||
            deviceManager?.cameras.length === 0
              ? false
              : true
        };
      }
    );
    const componentRemovedIncomingCalls = removedIncomingCalls.map(
      (
        incomingCall: IncomingCallState | /* @conditional-compile-remove(one-to-n-calling) */ TeamsIncomingCallState
      ) => {
        return {
          ...incomingCall,
          callerInfo: {
            displayName: incomingCall.callerInfo.displayName || 'Unknown Caller'
          },
          videoAvailable:
            (incomingCall.callerInfo.identifier && isPhoneNumberIdentifier(incomingCall.callerInfo.identifier)) ||
            deviceManager?.cameras.length === 0
              ? false
              : true
        };
      }
    );
    return {
      activeIncomingCalls: componentIncomingCalls,
      removedIncomingCalls: componentRemovedIncomingCalls
    };
  }
);
