// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getRemoteParticipants } from './baseSelectors';
import { RemoteParticipantState } from '@internal/calling-stateful-client';

/**
 * @private
 */
export const getRemoteParticipantsExcludingConsumers = createSelector(
  [getRemoteParticipants],
  (
    remoteParticipants
  ):
    | {
        [keys: string]: RemoteParticipantState;
      }
    | undefined => {
    {
      const newRemoteParticipants = { ...remoteParticipants };
      Object.keys(newRemoteParticipants).forEach((k) => {
        if (newRemoteParticipants[k].role === 'Consumer') {
          delete newRemoteParticipants[k];
        }
      });
      return newRemoteParticipants;
    }
  }
);
