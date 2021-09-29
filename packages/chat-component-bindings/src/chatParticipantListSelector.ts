// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getUserId, getDisplayName, getParticipants } from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationParticipant } from '@internal/react-components';

const convertChatParticipantsToCommunicationParticipants = (
  chatParticipants: ChatParticipant[]
): CommunicationParticipant[] => {
  return chatParticipants.map((participant: ChatParticipant) => {
    return {
      userId: toFlatCommunicationIdentifier(participant.id),
      displayName: participant.displayName
    };
  });
};

/**
 * get the index of moderator to help updating its display name if they are the local user or removing them from list of participants otherwise
 */
const moderatorIndex = (participants: CommunicationParticipant[]): number => {
  return participants.map((p) => p.displayName).indexOf(undefined);
};

/**
 * Selector for {@link ParticipantList} component.
 *
 * @public
 */
export const chatParticipantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: { [key: string]: ChatParticipant }, displayName) => {
    let participants = convertChatParticipantsToCommunicationParticipants(Object.values(chatParticipants));
    if (0 !== participants.length) {
      const moderatorIdx = moderatorIndex(participants);

      if (-1 !== moderatorIdx) {
        const userIndex = participants.map((p) => p.userId).indexOf(userId);
        if (moderatorIdx === userIndex) {
          participants[moderatorIdx].displayName = displayName;
        } else {
          participants = participants.filter((p) => p.displayName);
        }
      }
    }

    return {
      myUserId: userId,
      participants: participants
    };
  }
);
