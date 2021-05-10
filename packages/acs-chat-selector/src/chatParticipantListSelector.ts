// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { CommunicationIdentifierAsKey } from '@azure/acs-chat-declarative';
import { communicationIdentifierToString, getUserId, getDisplayName, getParticipants } from './baseSelectors';
import * as reselect from 'reselect';
import { ChatParticipant } from '@azure/communication-chat';
import { WebUiChatParticipant } from './types/WebUiChatParticipant';

const convertChatParticipantsToWebUiChatParticipants = (
  chatParticipants: ChatParticipant[]
): WebUiChatParticipant[] => {
  return chatParticipants.map((participant: ChatParticipant) => {
    return {
      userId: communicationIdentifierToString(participant.id),
      displayName: participant.displayName
    };
  });
};

export const chatParticipantListSelector = reselect.createSelector(
  [getUserId, getParticipants, getDisplayName],
  (userId, chatParticipants: Map<CommunicationIdentifierAsKey, ChatParticipant>, displayName) => {
    return {
      userId,
      displayName,
      chatParticipants: convertChatParticipantsToWebUiChatParticipants(Array.from(chatParticipants.values()))
    };
  }
);
