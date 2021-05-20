// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { ChatClientState } from 'chat-stateful-client';
// @ts-ignore
import { ChatBaseSelectorProps } from './baseSelectors';
import { getUserId, getDisplayName, getParticipants } from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationParticipant } from 'react-components';

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

export const chatParticipantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: Map<string, ChatParticipant>, displayName) => {
    let participants = convertChatParticipantsToCommunicationParticipants(Array.from(chatParticipants.values()));
    if (0 !== participants.length) {
      const userIndex = participants.map((p) => p.userId).indexOf(userId);
      if (-1 !== userIndex && !participants[userIndex].displayName) {
        participants[userIndex].displayName = displayName;
      }

      // removing any other undefined participants
      participants = participants.filter((p) => p.displayName);
    }

    return {
      myUserId: userId,
      participants: participants
    };
  }
);
