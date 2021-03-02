// © Microsoft Corporation. All rights reserved.
import { ChatMessage, ChatThreadClient, ListPageSettings } from '@azure/communication-chat';
import { ChatMessageWithStatus, MessageStatus } from './types/ChatMessageWithStatus';
import { Constants } from './Constants';
import { ChatContext } from './ChatContext';
import { nanoid } from 'nanoid';
import produce from 'immer';
import { enableMapSet } from 'immer';

enableMapSet();

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
              const message: ChatMessage = result.value;
              context.setState(
                produce(context.getState(), (draft) => {
                  if (message.id) {
                    draft.threads
                      .get(chatThreadClient.threadId)
                      ?.chatMessages?.set(message.id, convertChatMessage(message));
                  }
                })
              );
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
                  for (const message of page) {
                    if (message.id) {
                      context.setState(
                        produce(context.getState(), (draft) => {
                          draft.threads
                            .get(chatThreadClient.threadId)
                            ?.chatMessages?.set(message.id, convertChatMessage(message));
                        })
                      );
                    }
                  }
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

  public get<P extends keyof ChatThreadClient>(target: ChatThreadClient, prop: P): any {
    switch (prop) {
      case 'listMessages': {
        return proxyListMessages(target, this._context);
      }
      case 'getMessage': {
        const context = this._context;
        return async function (...args: Parameters<ChatThreadClient['getMessage']>) {
          const message = await target.getMessage(...args);
          context.setChatMessage(target.threadId, convertChatMessage(message));
          return message;
        };
      }
      case 'sendMessage': {
        // Retry logic?
        const context = this._context;
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
              context.batch(() => {
                context.setChatMessage(target.threadId, {
                  ...newMessage,
                  status: 'delivered',
                  id: result.id
                });
                context.setLocalMessageSynced(target.threadId, clientMessageId);
              });
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
}

export const chatThreadClientDeclaratify = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ChatThreadClient => {
  context.setThread(chatThreadClient.threadId, {
    failedMessageIds: [],
    chatMessages: new Map(),
    threadId: chatThreadClient.threadId,
    threadMembers: []
  });
  return new Proxy(chatThreadClient, new ProxyChatThreadClient(context)) as ChatThreadClient;
};
