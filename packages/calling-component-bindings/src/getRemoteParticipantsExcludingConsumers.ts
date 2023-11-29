// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getRemoteParticipants } from './baseSelectors';

/**
 * @private
 */
export const getRemoteParticipantsExcludingConsumers = createSelector([getRemoteParticipants], (remoteParticipants) => {
  /* @conditional-compile-remove(rooms) */
  {
    const participants = Object.values(remoteParticipants ?? {});
    return participants.filter((remoteParticipants) => remoteParticipants.role !== 'Consumer');
  }
  return remoteParticipants;
});
