// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage, ChatParticipant } from '@azure/communication-chat';
import { getIdentifierKind } from '@azure/communication-common';
import { ChatParticipant as SignalingChatParticipant } from '@azure/communication-signaling';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

/**
 * A paged async operator that asynchronously iterates over values in an array.
 * In paging mode, the whole array is returned as a single page, ignoring all page size options.
 */
export const pagedAsyncIterator = <T>(values: T[]): PagedAsyncIterableIterator<T, T[]> => {
  async function* listAll(values: T[]): AsyncIterableIterator<T> {
    yield* values;
  }

  async function* listByPage(): AsyncIterableIterator<T[]> {
    yield* [values];
  }

  const iter = listAll(values);

  return {
    next(): Promise<IteratorResult<T, T>> {
      return iter.next();
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage: () => {
      return listByPage();
    }
  };
};

export const chatToSignalingParticipant = (p: ChatParticipant): SignalingChatParticipant => ({
  id: getIdentifierKind(p.id),
  displayName: p.displayName ?? '',
  shareHistoryTime: p.shareHistoryTime
});

export const latestMessageTimestamp = (messages: ChatMessage[]): Date | undefined => {
  if (messages.length === 0) {
    return undefined;
  }
  return messages[messages.length - 1].createdOn;
};
