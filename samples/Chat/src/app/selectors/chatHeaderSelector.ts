// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { existsTopicName } from '../utils/utils';
import { createSelector } from 'reselect';
import { getTopicName, getUserId, getParticipants } from './baseSelectors';

const generateDefaultHeaderMessage = (participants: ChatParticipant[], userId: string): string => {
  let header = 'Chat with ';

  const remoteParticipantsWithNames = participants?.filter(
    (participant: ChatParticipant) =>
      toFlatCommunicationIdentifier(participant.id) !== userId && participant.displayName
  );

  if (!remoteParticipantsWithNames?.length) {
    header += 'yourself';
    return header;
  }

  // if we have at least one other participant we want to show names for the first 3
  const namedParticipants = remoteParticipantsWithNames.slice(0, 3);
  header += namedParticipants.map((participant: ChatParticipant) => participant.displayName).join(', ');

  // if we have more than 3 other participants we want to show the number of other participants
  if (remoteParticipantsWithNames.length > 3) {
    const len = remoteParticipantsWithNames.length - 3;
    header += ` and ${len} other participant${len === 1 ? '' : 's'}`;
  }

  return header;
};

export const chatHeaderSelector = createSelector(
  [getUserId, getTopicName, getParticipants],
  (userId, topicName, participants) => {
    return {
      userId,
      topicName: existsTopicName(topicName)
        ? topicName
        : generateDefaultHeaderMessage(Object.values(participants), userId)
    };
  }
);
