// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getRemoteParticipants } from './baseSelectors';
import { isMicrosoftTeamsAppIdentifier } from '@azure/communication-common';

/**
 * @private
 */
export const remoteParticipantsWithoutBotsSelector = createSelector([getRemoteParticipants], (remoteParticipants) =>
  remoteParticipants?.filter((participant) => !isMicrosoftTeamsAppIdentifier(participant.identifier))
);
