// © Microsoft Corporation. All rights reserved.

import { ChatParticipant } from '@azure/communication-chat';
import { existsTopicName } from 'app/utils/utils';
import { createSelector } from 'reselect';
import { getTopicName, getUserId, getParticipants } from './baseSelectors';

const generateDefaultHeaderMessage = (participants: ChatParticipant[], userId: string): string => {
  let header = 'Chat with ';

  const members = participants?.filter(
    (member: ChatParticipant) => member.user.communicationUserId !== userId && member.displayName
  );

  if (!members?.length) {
    header += 'yourself';
    return header;
  }

  // if we have at least one other participant we want to show names for the first 3
  const namedMembers = members.slice(0, 3);
  header += namedMembers.map((member: ChatParticipant) => member.displayName).join(', ');

  // if we have more than 3 other participants we want to show the number of other participants
  if (members.length > 3) {
    const len = members.length - 3;
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
        : generateDefaultHeaderMessage(Array.from(participants.values()), userId)
    };
  }
);
