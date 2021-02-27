// © Microsoft Corporation. All rights reserved.
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { ChatMessageWithStatus, MessageStatus } from './types/ChatMessageWithStatus';
import { Constants } from './Constants';
import { ChatContext } from './ChatContext';
import { nanoid } from 'nanoid';

let context: ChatContext;

export const convertChatMessage = (
  message: ChatMessage,
  status: MessageStatus = 'delivered',
  clientMessageId?: string
): ChatMessageWithStatus => {
  return {
    ...message,
    clientMessageId: clientMessageId,
    status
  };
};

const proxyChatThreadClient: ProxyHandler<ChatThreadClient> = {
  get: function <P extends keyof ChatThreadClient>(target: ChatThreadClient, prop: P) {
    switch (prop) {
      case 'listMessages': {
        // TODO: wrap the async iterator with another async iterator
        // every time we call/user calls this function, it will update state in context
        return function (...args: Parameters<ChatThreadClient['listMessages']>) {
          return target.listMessages(...args);
        };
      }
      case 'getMessage': {
        return async function (...args: Parameters<ChatThreadClient['getMessage']>) {
          const message = await target.getMessage(...args);
          context.setChatMessage(target.threadId, convertChatMessage(message));
          return message;
        };
      }
      case 'sendMessage': {
        // Retry logic?
        return async function (...args: Parameters<ChatThreadClient['sendMessage']>) {
          const { content } = args[0];
          const clientMessageId = nanoid(); // Generate a local short uuid for message
          const newMessage: ChatMessageWithStatus = {
            content,
            clientMessageId,
            createdOn: undefined,
            status: 'sending'
          };
          context.setChatMessage(target.threadId, newMessage);

          const result = await target.sendMessage(...args);
          if (result._response.status === Constants.CREATED) {
            if (result.id) {
              context.startBatch();
              context.setChatMessage(target.threadId, {
                ...newMessage,
                status: 'delivered',
                id: result.id
              });
              context.setLocalMessageSynced(target.threadId, clientMessageId);
              context.endBatch();
            }
          } else if (result._response.status === Constants.PRECONDITION_FAILED_STATUS_CODE) {
            context.setChatMessage(target.threadId, { ...newMessage, status: 'failed' });
          }
          return result;
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
};

export const chatThreadClientDeclaratify = (
  chatThreadClient: ChatThreadClient,
  chatContext: ChatContext
): ChatThreadClient => {
  context = chatContext;
  context.setThread(chatThreadClient.threadId, {
    failedMessageIds: [],
    chatMessages: new Map(),
    threadId: chatThreadClient.threadId,
    threadMembers: []
  });
  return new Proxy(chatThreadClient, proxyChatThreadClient) as ChatThreadClient;
};
