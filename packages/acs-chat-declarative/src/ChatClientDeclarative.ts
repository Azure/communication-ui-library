// © Microsoft Corporation. All rights reserved.
import { ChatClient, ChatThread, ChatThreadInfo, ListPageSettings } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { ChatClientState } from './ChatClientState';
import { EventSubscriber } from './EventSubscriber';
import { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';
import { Constants } from './Constants';

export interface DeclarativeChatClient extends ChatClient {
  state: ChatClientState;
  onStateChange(handler: (state: ChatClientState) => void): void;
}

const context: ChatContext = new ChatContext();

const convertChatThreadInfo = (chatThreadInfo: ChatThreadInfo): ChatThread => {
  return {
    id: chatThreadInfo.id,
    createdOn: Constants.DUMMY_DATE,
    topic: chatThreadInfo.topic
  };
};

const proxyListThreads = (chatClient: ChatClient, context: ChatContext) => {
  return (...args: Parameters<ChatClient['listChatThreads']>) => {
    const threadsIterator = chatClient.listChatThreads(...args);
    return {
      async next() {
        const result = await threadsIterator.next();
        if (!result.done && result.value) {
          const chatThread = convertChatThreadInfo(result.value);
          context.createThreadIfNotExist(chatThread.id, chatThread) || context.updateThread(chatThread.id, chatThread);
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
                  const chatThread = convertChatThreadInfo(threadInfo);
                  context.createThreadIfNotExist(chatThread.id, chatThread) ||
                    context.updateThread(chatThread.id, chatThread);
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
          const response = await chatClient.createChatThread(...args);
          const thread = response.chatThread;

          if (thread) {
            const threadInfo = { ...thread, createdBy: { communicationUserId: thread.id } };
            context.createThread(thread.id, threadInfo);
          }
          return response;
        };
      }
      case 'getChatThread': {
        return async function (...args: Parameters<ChatClient['getChatThread']>) {
          const { _response: _, ...thread } = await chatClient.getChatThread(...args);
          if (thread) {
            context.createThreadIfNotExist(thread.id, thread) || context.updateThread(thread.id, thread);
          }
        };
      }
      case 'deleteChatThread': {
        return async function (...args: Parameters<ChatClient['deleteChatThread']>) {
          const result = await chatClient.deleteChatThread(...args);
          const { _response } = result;
          if (_response.status === Constants.OK || _response.status === Constants.DELETED) {
            context.removeThread(args[0]);
          }
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
