// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatMessage as GraphChatMessage,
  AadUserConversationMember as GraphChatParticipant
} from '@microsoft/microsoft-graph-types';

import { ChatParticipant as ACSChatParticipant, ChatMessage as ACSChatMessage } from '@azure/communication-chat';

export const graphParticipantToACSParticipant = (graphParticipant: GraphChatParticipant): ACSChatParticipant => {
  if (!graphParticipant.userId) {
    throw new Error('Cannot convert graph participant to ACS participant. No ID found on graph participant');
  }

  return {
    id: {
      id: graphParticipant.userId
    },
    displayName: graphParticipant.displayName ?? undefined
  };
};

export const graphChatMessageToACSChatMessage = (graphMessage: GraphChatMessage): ACSChatMessage => {
  if (!graphMessage.id) {
    throw new Error('Cannot convert graph message to ACS message. No ID found on graph message');
  }
  return {
    id: graphMessage.id,
    type: 'text',
    sequenceId: graphMessage.id,
    version: graphMessage.etag ?? 'no version specified',
    content: {
      message: graphMessage.body?.content ?? undefined
    },
    senderDisplayName: graphMessage.from?.user?.displayName ?? undefined,
    createdOn: new Date(graphMessage.createdDateTime ?? Date.now()),
    sender: graphMessage.from?.user?.id ? { id: graphMessage.from?.user?.id, kind: 'unknown' } : undefined
  };
};
