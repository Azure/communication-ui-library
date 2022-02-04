// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClient, SendChatMessageResult } from '@azure/communication-chat';
import { getIdentifierKind } from '@azure/communication-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { ChatContext } from './ChatContext';
import { nanoid } from 'nanoid';
import { createDecoratedListMessages } from './iterators/createDecoratedListMessages';
import { createDecoratedListReadReceipts } from './iterators/createDecoratedListReadReceipts';
import { createDecoratedListParticipants } from './iterators/createDecoratedListParticipants';
import { convertChatMessage } from './convertChatMessage';

class ProxyChatThreadClient implements ProxyHandler<ChatThreadClient> {
  private _context: ChatContext;

  constructor(context: ChatContext) {
    this._context = context;
  }

  public get<P extends keyof ChatThreadClient>(chatThreadClient: ChatThreadClient, prop: P): any {
    switch (prop) {
      case 'listMessages': {
        return createDecoratedListMessages(chatThreadClient, this._context);
      }
      case 'getMessage': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<ChatThreadClient['getMessage']>) => {
          const message = await chatThreadClient.getMessage(...args);
          this._context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
          return message;
        }, 'ChatThreadClient.getMessage');
      }
      case 'sendMessage': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<ChatThreadClient['sendMessage']>) => {
          // Retry logic?
          const { content } = args[0];
          const clientMessageId = nanoid(); // Generate a local short uuid for message
          const newMessage: ChatMessageWithStatus = {
            content: { message: content },
            clientMessageId,
            id: '',
            type: 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
            status: 'sending',
            senderDisplayName: this._context.getState().displayName,
            sender: this._context.getState().userId
          };
          this._context.setChatMessage(chatThreadClient.threadId, newMessage);

          let result: SendChatMessageResult | undefined = undefined;
          try {
            result = await chatThreadClient.sendMessage(...args);
          } catch (e) {
            this._context.setChatMessage(chatThreadClient.threadId, { ...newMessage, status: 'failed' });
            throw e;
          }

          if (result?.id) {
            this._context.batch(() => {
              if (!result) {
                return;
              }
              this._context.setChatMessage(chatThreadClient.threadId, {
                ...newMessage,
                clientMessageId: undefined,
                status: 'delivered',
                id: result.id
              });
              this._context.deleteLocalMessage(chatThreadClient.threadId, clientMessageId);
            });
          }
          return result;
        }, 'ChatThreadClient.sendMessage');
      }
      case 'addParticipants': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['addParticipants']>) => {
            const result = await chatThreadClient.addParticipants(...args);
            const [addRequest] = args;
            const participantsToAdd = addRequest.participants;
            this._context.setParticipants(chatThreadClient.threadId, participantsToAdd);
            return result;
          },
          'ChatThreadClient.addParticipants'
        );
      }
      case 'deleteMessage': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['deleteMessage']>) => {
            // DeleteMessage is able to either delete local one(for failed message) or synced message
            const [messageId] = args;
            if (this._context.deleteLocalMessage(chatThreadClient.threadId, messageId)) {
              return {};
            }
            const result = await chatThreadClient.deleteMessage(...args);
            this._context.deleteMessage(chatThreadClient.threadId, messageId);
            return result;
          },
          'ChatThreadClient.deleteMessage'
        );
      }
      case 'listParticipants': {
        return createDecoratedListParticipants(chatThreadClient, this._context);
      }
      case 'listReadReceipts': {
        return createDecoratedListReadReceipts(chatThreadClient, this._context);
      }
      case 'removeParticipant': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['removeParticipant']>) => {
            const result = await chatThreadClient.removeParticipant(...args);
            const [removeIdentifier] = args;
            this._context.deleteParticipant(chatThreadClient.threadId, getIdentifierKind(removeIdentifier));
            return result;
          },
          'ChatThreadClient.removeParticipant'
        );
      }
      case 'updateMessage': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['updateMessage']>) => {
            const result = await chatThreadClient.updateMessage(...args);
            const [messageId, updateOption] = args;

            this._context.updateChatMessageContent(chatThreadClient.threadId, messageId, updateOption?.content);
            return result;
          },
          'ChatThreadClient.updateMessage'
        );
      }
      case 'updateTopic': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<ChatThreadClient['updateTopic']>) => {
          const result = await chatThreadClient.updateTopic(...args);
          const [topic] = args;
          this._context.updateThreadTopic(chatThreadClient.threadId, topic);
          return result;
        }, 'ChatThreadClient.updateTopic');
      }
      case 'getProperties': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['getProperties']>) => {
            const result = await chatThreadClient.getProperties(...args);
            this._context.updateThread(chatThreadClient.threadId, result);
            return result;
          },
          'ChatThreadClient.getProperties'
        );
      }
      default:
        return Reflect.get(chatThreadClient, prop);
    }
  }
}

/**
 * @private
 */
export const chatThreadClientDeclaratify = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ChatThreadClient => {
  context.createThreadIfNotExist(chatThreadClient.threadId);
  return new Proxy(chatThreadClient, new ProxyChatThreadClient(context)) as ChatThreadClient;
};
