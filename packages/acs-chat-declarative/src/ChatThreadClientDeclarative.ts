// © Microsoft Corporation. All rights reserved.
import { ChatMessage, ChatThreadClient, ListPageSettings } from '@azure/communication-chat';
import { ChatMessageWithStatus, MessageStatus } from './types/ChatMessageWithStatus';
import { Constants } from './Constants';
import { ChatContext } from './ChatContext';
import { nanoid } from 'nanoid';

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

/**
 * Proxies chatThreadClient.listMessages() and updates the proxied state via getState and setState by wrapping the
 * returned iterators.
 *
 * @param chatThreadClient
 * @param getState
 * @param setState
 */
const proxyListMessages = (chatThreadClient: ChatThreadClient, context: ChatContext) => {
  return (...args: Parameters<ChatThreadClient['listMessages']>) => {
    const messages = chatThreadClient.listMessages(...args);
    return {
      next() {
        return new Promise<IteratorResult<ChatMessage, ChatMessage>>((resolve) => {
          messages.next().then((result) => {
            if (!result.done && result.value) {
              context.setChatMessage(chatThreadClient.threadId, convertChatMessage(result.value));
            }
            resolve(result);
          });
        });
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings: ListPageSettings = {}): AsyncIterableIterator<ChatMessage[]> => {
        const pages = messages.byPage(settings);
        return {
          next() {
            return new Promise<IteratorResult<ChatMessage[], any>>((resolve) => {
              pages.next().then((result) => {
                const page: any = result.value;
                if (!result.done && result.value) {
                  context.batch(() => {
                    for (const message of page) {
                      context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
                    }
                  });
                }
                resolve(result);
              });
            });
          },
          [Symbol.asyncIterator]() {
            return this;
          }
        };
      }
    };
  };
};

class ProxyChatThreadClient implements ProxyHandler<ChatThreadClient> {
  private _context: ChatContext;

  constructor(context: ChatContext) {
    this._context = context;
  }

  public get<P extends keyof ChatThreadClient>(chatThreadClient: ChatThreadClient, prop: P): any {
    switch (prop) {
      case 'listMessages': {
        return proxyListMessages(chatThreadClient, this._context);
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
            status: 'sending'
          };
          this._context.setChatMessage(chatThreadClient.threadId, newMessage);

          const result = await chatThreadClient.sendMessage(...args);
          if (result._response.status === Constants.CREATED) {
            if (result.id) {
              this._context.batch(() => {
                this._context.setChatMessage(chatThreadClient.threadId, {
                  ...newMessage,
                  clientMessageId: undefined,
                  status: 'delivered',
                  id: result.id
                });
                this._context.deleteLocalMessage(chatThreadClient.threadId, clientMessageId);
              });

              const message = await chatThreadClient.getMessage(result.id);
              const messageInState = this._context
                .getState()
                .threads.get(chatThreadClient.threadId)
                ?.chatMessages.get(result.id);

              if (!messageInState?.version) {
                this._context.setChatMessage(chatThreadClient.threadId, {
                  ...message,
                  status: 'delivered'
                });
              }
            }
          } else if (result._response.status === Constants.PRECONDITION_FAILED_STATUS_CODE) {
            this._context.setChatMessage(chatThreadClient.threadId, { ...newMessage, status: 'failed' });
          }
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
