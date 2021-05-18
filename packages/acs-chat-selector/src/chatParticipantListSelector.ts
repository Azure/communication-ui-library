// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { ChatClientState } from 'chat-stateful-client';
// @ts-ignore
import { ChatBaseSelectorProps } from './baseSelectors';
import { getUserId, getDisplayName, getParticipants } from './baseSelectors';
import * as reselect from 'reselect';
import { FlatCommunicationIdentifier, toFlatCommunicationIdentifier } from 'acs-ui-common';
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
  (userId, chatParticipants: Map<FlatCommunicationIdentifier, ChatParticipant>, displayName) => {
    return {
      myUserId: userId,
      displayName,
      participants: convertChatParticipantsToCommunicationParticipants(Array.from(chatParticipants.values()))
    };
  }
);
