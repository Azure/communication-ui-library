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

const context: ChatContext = new ChatContext();

const proxyListThreads = (chatClient: ChatClient, context: ChatContext) => {
  return (...args: Parameters<ChatClient['listChatThreads']>) => {
    const threadsIterator = chatClient.listChatThreads(...args);
    return {
      async next() {
        const result = await threadsIterator.next();
        if (!result.done && result.value) {
          const chatThreadInfo = result.value;
          context.createThreadIfNotExist(chatThreadInfo.id, chatThreadInfo) ||
            context.updateThread(chatThreadInfo.id, chatThreadInfo);
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
                  context.createThreadIfNotExist(threadInfo.id, threadInfo) ||
                    context.updateThread(threadInfo.id, threadInfo);
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
  get: function <P extends keyof ChatClient>(chatClient: ChatClient, prop: P) {
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
            context.createThreadIfNotExist(thread.id, thread) || context.updateThread(thread.id, thread);
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
          new EventSubscriber(chatClient, context);
          return ret;
        };
      }
      default:
        return Reflect.get(chatClient, prop);
    }
  }
};

export const chatClientDeclaratify = (chatClient: ChatClient): DeclarativeChatClient => {
  Object.defineProperty(chatClient, 'state', {
    configurable: false,
    get: () => context?.getState()
  });
  Object.defineProperty(chatClient, 'onStateChange', {
    configurable: false,
    value: (handler: (state: ChatClientState) => void) => context?.onStateChange(handler)
  });
  return new Proxy(chatClient, proxyChatClient) as DeclarativeChatClient;
};
