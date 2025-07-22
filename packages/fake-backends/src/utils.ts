// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

/**
 * An iterator that throws the given error when asynchronously iterating over items, directly or byPage.
 */
export const failingPagedAsyncIterator = <T>(error: Error): PagedAsyncIterableIterator<T, T[]> => {
  return {
    async next() {
      throw error;
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage: (): AsyncIterableIterator<T[]> => {
      return {
        async next() {
          throw error;
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
  };
};

/**
 *
 * Converts a ChatParticipant to a SignalingChatParticipant.
 * @param p ChatParticipant to convert
 * @returns SignalingChatParticipant
 * @throws Error if the identifier kind is 'microsoftTeamsApp'
 */
export const chatToSignalingParticipant = (p: ChatParticipant): SignalingChatParticipant => {
  const identifier = getIdentifierKind(p.id);

  if (identifier.kind === 'microsoftTeamsApp') {
    throw new Error('Unsupported indentifier kind: microsoftBot');
  }
  if (identifier.kind === 'teamsExtensionUser') {
    throw new Error('Unsupported indentifier kind: teamsExtensionUser');
  }

  return {
    id: identifier,
    displayName: p.displayName ?? '',
    shareHistoryTime: p.shareHistoryTime,
    metadata: {}
  };
};

/**
 * Returns the timestamp of the latest message in the chat messages array.
 * @param messages Array of ChatMessage objects
 * @returns Date of the latest message or undefined if there are no messages
 */
export const latestMessageTimestamp = (messages: ChatMessage[]): Date | undefined => {
  return messages[messages.length - 1]?.createdOn;
};
