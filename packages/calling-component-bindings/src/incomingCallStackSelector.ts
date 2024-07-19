// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, IncomingCallState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(one-to-n-calling) */
import { TeamsIncomingCallState } from '@internal/calling-stateful-client';
import { getIncomingCalls, getRemovedIncomingCalls } from './baseSelectors';
import { createSelector } from 'reselect';
import { ActiveIncomingCall } from '@internal/react-components';

/**
 * Selector to get the active and removed incoming calls.
 * @beta
 */
export type IncomingCallStackSelector = (state: CallClientState) => {
  activeIncomingCalls: ActiveIncomingCall[];
  removedIncomingCalls: ActiveIncomingCall[];
};

/**
 * Select the active and removed incoming calls from the stateful client for the IncomingCallNotificationStackComponent.
 * @beta
 */
export const incomingCallStackSelector: IncomingCallStackSelector = createSelector(
  [getIncomingCalls, getRemovedIncomingCalls],
  (
    incomingCalls,
    removedIncomingCalls
  ): {
    activeIncomingCalls: ActiveIncomingCall[];
    removedIncomingCalls: ActiveIncomingCall[];
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
          }
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
          }
        };
      }
    );
    return {
      activeIncomingCalls: componentIncomingCalls,
      removedIncomingCalls: componentRemovedIncomingCalls
    };
  }
);
