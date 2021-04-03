// © Microsoft Corporation. All rights reserved.
import { ChatParticipant, ChatThreadClient, RestListParticipantsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

export const createDecoratedListParticipants = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ((options?: RestListParticipantsOptions) => PagedAsyncIterableIterator<ChatParticipant>) => {
  const setParticipant = (participant: ChatParticipant, context: ChatContext): void => {
    context.setParticipant(chatThreadClient.threadId, participant);
  };
  return createDecoratedIterator(chatThreadClient.listParticipants.bind(chatThreadClient), context, setParticipant);
};
