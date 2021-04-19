// © Microsoft Corporation. All rights reserved.
import { ChatThreadClient, SendChatMessageResult, WithResponse } from '@azure/communication-chat';
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
        return async (...args: Parameters<ChatThreadClient['getMessage']>) => {
          const message = await chatThreadClient.getMessage(...args);
          this._context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
          return message;
        };
      }
      case 'sendMessage': {
        // Retry logic?
        return async (...args: Parameters<ChatThreadClient['sendMessage']>) => {
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
            sender: { communicationUserId: this._context.getState().userId }
          };
          this._context.setChatMessage(chatThreadClient.threadId, newMessage);

          let result: WithResponse<SendChatMessageResult> | undefined = undefined;
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
        };
      }
      case 'addParticipants': {
        return async (...args: Parameters<ChatThreadClient['addParticipants']>) => {
          const result = await chatThreadClient.addParticipants(...args);
          const [addRequest] = args;
          const participantsToAdd = addRequest.participants;
          this._context.setParticipants(chatThreadClient.threadId, participantsToAdd);
          return result;
        };
      }
      case 'deleteMessage': {
        return async (...args: Parameters<ChatThreadClient['deleteMessage']>) => {
          // DeleteMessage is able to either delete local one(for failed message) or synced message
          const [messageId] = args;
          if (this._context.deleteLocalMessage(chatThreadClient.threadId, messageId)) {
            return {};
          }
          const result = await chatThreadClient.deleteMessage(...args);
          this._context.deleteMessage(chatThreadClient.threadId, messageId);
          return result;
        };
      }
      case 'listParticipants': {
        return createDecoratedListParticipants(chatThreadClient, this._context);
      }
      case 'listReadReceipts': {
        return createDecoratedListReadReceipts(chatThreadClient, this._context);
      }
      case 'removeParticipant': {
        return async (...args: Parameters<ChatThreadClient['removeParticipant']>) => {
          const result = await chatThreadClient.removeParticipant(...args);
          const [removeIdentifier] = args;
          this._context.deleteParticipant(chatThreadClient.threadId, removeIdentifier.communicationUserId);
          return result;
        };
      }
      case 'updateMessage': {
        return async (...args: Parameters<ChatThreadClient['updateMessage']>) => {
          const result = await chatThreadClient.updateMessage(...args);
          const [messageId, updateOption] = args;

          this._context.updateChatMessageContent(chatThreadClient.threadId, messageId, updateOption?.content);
          return result;
        };
      }
      case 'updateThread': {
        return async (...args: Parameters<ChatThreadClient['updateThread']>) => {
          const result = await chatThreadClient.updateThread(...args);
          const [updateOption] = args;

          this._context.updateThreadTopic(chatThreadClient.threadId, updateOption?.topic);
          return result;
        };
      }
      default:
        return Reflect.get(chatThreadClient, prop);
    }
  }
}

export const chatThreadClientDeclaratify = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ChatThreadClient => {
  context.createThreadIfNotExist(chatThreadClient.threadId);
  return new Proxy(chatThreadClient, new ProxyChatThreadClient(context)) as ChatThreadClient;
};
