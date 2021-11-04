// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getUserId, getDisplayName, getParticipants, ChatBaseSelectorProps } from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatParticipant } from '@azure/communication-chat';
import { ParticipantListParticipant } from '@internal/react-components';
import { ChatClientState } from '@internal/chat-stateful-client';

const convertChatParticipantsToCommunicationParticipants = (
  chatParticipants: ChatParticipant[]
): ParticipantListParticipant[] => {
  return chatParticipants.map((participant: ChatParticipant) => {
    return {
      userId: toFlatCommunicationIdentifier(participant.id),
      displayName: participant.displayName,
      // xkcd: FIXME
      isRemovable: true
    };
  });
};

/**
 * get the index of moderator to help updating its display name if they are the local user or removing them from list of participants otherwise
 */
const moderatorIndex = (participants: ParticipantListParticipant[]): number => {
  return participants.map((p) => p.displayName).indexOf(undefined);
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
