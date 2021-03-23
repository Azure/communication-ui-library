// © Microsoft Corporation. All rights reserved.
import { ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';

export const createDecoratedListParticipants = (chatThreadClient: ChatThreadClient, context: ChatContext) => {
  const setParticipant = (participant: ChatParticipant, context: ChatContext) => {
    context.setParticipant(chatThreadClient.threadId, participant);
  };
  return createDecoratedIterator(chatThreadClient.listParticipants.bind(chatThreadClient), context, setParticipant);
};
