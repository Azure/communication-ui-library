// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getUserId, getDisplayName, getParticipants, ChatBaseSelectorProps } from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatParticipant } from '@azure/communication-chat';
import { ParticipantListParticipant } from '@internal/react-components';
import { ChatClientState } from '@internal/chat-stateful-client';
import { getIdentifierKind } from '@azure/communication-common';

const convertChatParticipantsToCommunicationParticipants = (
  chatParticipants: ChatParticipant[]
): ParticipantListParticipant[] => {
  return chatParticipants.map((participant: ChatParticipant) => {
    return {
      userId: toFlatCommunicationIdentifier(participant.id),
      displayName: participant.displayName,
      // ACS users can not remove Teams users.
      // Removing phone numbers or unknown types of users is undefined.
      isRemovable: getIdentifierKind(participant.id).kind === 'communicationUser'
    };
  });
};

/**
 * get the moderator to help updating its display name if they are the local user or removing them from list of participants otherwise
 */
const getModerator = (participants: ParticipantListParticipant[]): ParticipantListParticipant | undefined => {
  return participants.find((p) => p.displayName === undefined);
};

/**
 * Selector type for {@link ParticipantList} component.
 *
 * @public
 */
export type ChatParticipantListSelector = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
) => {
  myUserId: string;
  participants: ParticipantListParticipant[];
};

/**
 * Selector for {@link ParticipantList} component.
 *
 * @public
 */
export const chatParticipantListSelector: ChatParticipantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: { [key: string]: ChatParticipant }, displayName) => {
    let participants = convertChatParticipantsToCommunicationParticipants(Object.values(chatParticipants));

    // Update the moderator display name if they are the local user, otherwise remove them from list of participants
    const moderator = getModerator(participants);
    if (moderator?.userId === userId) {
      moderator.displayName = displayName;
    } else {
      participants = participants.filter((p) => p.displayName);
    }

    return {
      myUserId: userId,
      participants: participants
    };
  }
);
