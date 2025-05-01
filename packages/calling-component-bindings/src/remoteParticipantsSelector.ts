// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { CallingBaseSelectorProps, getRemoteParticipants, getRemoteParticipantsEnded } from './baseSelectors';
import * as reselect from 'reselect';

/**
 * Selector type for all remote participants.
 * @public
 */
export type AllRemoteParticipantsSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) =>
  | {
      [key: string]: RemoteParticipantState;
    }
  | undefined;

/**
 * Selector for all remote participants in a call, active and inactive.
 * @public
 */
export const allRemoteParticipantsSelector: AllRemoteParticipantsSelector = reselect.createSelector(
  [getRemoteParticipants, getRemoteParticipantsEnded],
  (remoteParticipants, remoteParticipantsEnded) => {
    // Combine remoteParticipants and remoteParticipantsEnded into a single object
    return {
      ...remoteParticipants,
      ...remoteParticipantsEnded
    };
  }
);
