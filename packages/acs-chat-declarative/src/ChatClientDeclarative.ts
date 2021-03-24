// © Microsoft Corporation. All rights reserved.
import { ChatClient, ChatThreadInfo, ListPageSettings } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { ChatClientState } from './ChatClientState';
import { EventSubscriber } from './EventSubscriber';
import { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';

export interface DeclarativeChatClient extends ChatClient {
  state: ChatClientState;
  onStateChange(handler: (state: ChatClientState) => void): void;
}

export interface DeclarativeChatClientWithPrivateProps extends DeclarativeChatClient {
  context: ChatContext;
  eventSubscriber: EventSubscriber | undefined;
}

const proxyListThreads = (chatClient: ChatClient, context: ChatContext) => {
  return (...args: Parameters<ChatClient['listChatThreads']>) => {
    const threadsIterator = chatClient.listChatThreads(...args);
    return {
      async next() {
        const result = await threadsIterator.next();
        if (!result.done && result.value) {
          const chatThreadInfo = result.value;
          if (!context.createThreadIfNotExist(chatThreadInfo.id, chatThreadInfo)) {
            context.updateThread(chatThreadInfo.id, chatThreadInfo);
          }
        }
        return result;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings: ListPageSettings = {}): AsyncIterableIterator<ChatThreadInfo[]> => {
        const pages = threadsIterator.byPage(settings);
        return {
          async next() {
            const result = await pages.next();
            const page = result.value;
            if (!result.done && result.value) {
              context.batch(() => {
                for (const threadInfo of page) {
                  if (!context.createThreadIfNotExist(threadInfo.id, threadInfo)) {
                    context.updateThread(threadInfo.id, threadInfo);
                  }
                }
              });
            }
            return result;
          },
          [Symbol.asyncIterator]() {
            return this;
          }
        };
      }
    };
  };
};

const proxyChatClient: ProxyHandler<ChatClient> = {
  get: function <P extends keyof DeclarativeChatClientWithPrivateProps>(
    chatClient: ChatClient,
    prop: P,
    receiver: DeclarativeChatClientWithPrivateProps
  ) {
    // skip receiver.context call to avoid recursive bugs
    if (prop === 'context') {
      return Reflect.get(chatClient, prop);
    }

    const context = receiver.context;
    switch (prop) {
      case 'createChatThread': {
        return async function (...args: Parameters<ChatClient['createChatThread']>) {
          const result = await chatClient.createChatThread(...args);
          const thread = result.chatThread;

          if (thread) {
            const threadInfo = { ...thread, createdBy: { communicationUserId: thread.createdBy } };
            context.createThread(thread.id, threadInfo);
          }
          return result;
        };
      }
      case 'getChatThread': {
        return async function (...args: Parameters<ChatClient['getChatThread']>) {
          const result = await chatClient.getChatThread(...args);
          const { _response: _, ...thread } = result;
          if (thread) {
            if (!context.createThreadIfNotExist(thread.id, thread)) {
              context.updateThread(thread.id, thread);
            }
          }
          return result;
        };
      }
      case 'deleteChatThread': {
        return async function (...args: Parameters<ChatClient['deleteChatThread']>) {
          const result = await chatClient.deleteChatThread(...args);
          context.removeThread(args[0]);
          return result;
        };
      }
      case 'listChatThreads': {
        return proxyListThreads(chatClient, context);
      }
      case 'getChatThreadClient': {
        return async function (...args: Parameters<ChatClient['getChatThreadClient']>) {
          const chatThreadClient = await chatClient.getChatThreadClient(...args);
          return chatThreadClientDeclaratify(chatThreadClient, context);
        };
      }
      case 'startRealtimeNotifications': {
        return async function (...args: Parameters<ChatClient['startRealtimeNotifications']>) {
          const ret = await chatClient.startRealtimeNotifications(...args);
          if (!receiver.eventSubscriber) {
            receiver.eventSubscriber = new EventSubscriber(chatClient, context);
          }

          return ret;
        };
      }
      case 'stopRealtimeNotifications': {
        return async function (...args: Parameters<ChatClient['stopRealtimeNotifications']>) {
          const ret = await chatClient.stopRealtimeNotifications(...args);
          if (receiver.eventSubscriber) {
            receiver.eventSubscriber.unsubscribe();
            receiver.eventSubscriber = undefined;
          }

          return ret;
        };
      }
      default:
        return Reflect.get(chatClient, prop);
    }
  }
};

export const chatClientDeclaratify = (chatClient: ChatClient): DeclarativeChatClient => {
  const context = new ChatContext();
  let eventSubscriber: EventSubscriber;

  const proxy = new Proxy(chatClient, proxyChatClient);

  Object.defineProperty(proxy, 'context', {
    configurable: false,
    get: () => context
  });

  Object.defineProperty(proxy, 'eventSubscriber', {
    configurable: false,
    get: () => eventSubscriber,
    set: (val: EventSubscriber) => {
      eventSubscriber = val;
    }
  });

  Object.defineProperty(proxy, 'state', {
    configurable: false,
    get: () => context?.getState()
  });
  Object.defineProperty(proxy, 'onStateChange', {
    configurable: false,
    value: (handler: (state: ChatClientState) => void) => context?.onStateChange(handler)
  });
  return proxy as DeclarativeChatClient;
};
