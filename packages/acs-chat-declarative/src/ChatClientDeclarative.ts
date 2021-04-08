// © Microsoft Corporation. All rights reserved.
import { ChatClient } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { ChatClientState } from './ChatClientState';
import { EventSubscriber } from './EventSubscriber';
import { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';
import { createDecoratedListThreads } from './iterators/createDecoratedListThreads';
import { ChatConfig } from './types/ChatConfig';

export interface DeclarativeChatClient extends ChatClient {
  state: ChatClientState;
  onStateChange(handler: (state: ChatClientState) => void): void;
  offStateChange(handler: (state: ChatClientState) => void): void;
}

export interface DeclarativeChatClientWithPrivateProps extends DeclarativeChatClient {
  context: ChatContext;
  eventSubscriber: EventSubscriber | undefined;
}

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
            context.batch(() => {
              context.createThread(thread.id, threadInfo);
              const [request] = args;
              context.setParticipants(thread.id, request.participants);
            });
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
          context.deleteThread(args[0]);
          return result;
        };
      }
      case 'listChatThreads': {
        return createDecoratedListThreads(chatClient, context);
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

export const chatClientDeclaratify = (chatClient: ChatClient, chatConfig: ChatConfig): DeclarativeChatClient => {
  const context = new ChatContext();
  let eventSubscriber: EventSubscriber;

  context.updateChatConfig(chatConfig);

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
  Object.defineProperty(proxy, 'offStateChange', {
    configurable: false,
    value: (handler: (state: ChatClientState) => void) => context?.offStateChange(handler)
  });
  return proxy as DeclarativeChatClient;
};
