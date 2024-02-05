// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatParticipant, ChatThreadClient, RestListParticipantsOptions } from '@azure/communication-chat';
import { _ChatContext } from '../ChatContext';
import { createDecoratedIterator, createErrorHandlingIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

/**
 * @private
 */
export const createDecoratedListParticipants = (
  chatThreadClient: ChatThreadClient,
  context: _ChatContext
): ((options?: RestListParticipantsOptions) => PagedAsyncIterableIterator<ChatParticipant>) => {
  const setParticipant = (participant: ChatParticipant, context: _ChatContext): void => {
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
