// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatThreadClient, RestListParticipantsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator, createErrorHandlingIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

/**
 * @private
 */
export const createDecoratedListParticipants = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ((options?: RestListParticipantsOptions) => PagedAsyncIterableIterator<ChatParticipant>) => {
  const setParticipant = (participant: ChatParticipant, context: ChatContext): void => {
    context.setParticipant(chatThreadClient.threadId, participant);
  };
  return createDecoratedIterator(
    createErrorHandlingIterator(
      context.withErrorTeedToState(
        chatThreadClient.listParticipants.bind(chatThreadClient),
        'ChatThreadClient.listParticipants'
      ),
      context,
      'ChatThreadClient.listParticipants'
    ),
    context,
    setParticipant
  );
};
