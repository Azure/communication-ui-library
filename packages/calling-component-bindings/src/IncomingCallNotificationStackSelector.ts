// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, IncomingCallState, TeamsIncomingCallState } from '@internal/calling-stateful-client';
import { getIncomingCalls, getRemovedIncomingCalls } from './baseSelectors';
import { createSelector } from 'reselect';

/**
 * Selector to get the active and removed incoming calls.
 * @beta
 */
export type IncomingCallNotificationStackSelector = (state: CallClientState) => {
  activeIncomingCalls: IncomingCallState[] | TeamsIncomingCallState[];
  removedIncomingCalls: IncomingCallState[] | TeamsIncomingCallState[];
};

/**
 * Select the active and removed incoming calls from the stateful client for the IncomingCallNotificationStackComponent.
 * @beta
 */
export const incomingCallNotificationStackSelector: IncomingCallNotificationStackSelector = createSelector(
  [getIncomingCalls, getRemovedIncomingCalls],
  (
    incomingCalls,
    removedIncomingCalls
  ): {
    activeIncomingCalls: IncomingCallState[] | TeamsIncomingCallState[];
    removedIncomingCalls: IncomingCallState[] | TeamsIncomingCallState[];
  } => {
    return {
      activeIncomingCalls: incomingCalls,
      removedIncomingCalls: removedIncomingCalls
    };
  }
);
