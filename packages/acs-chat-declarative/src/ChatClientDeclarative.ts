// © Microsoft Corporation. All rights reserved.
import { ChatClient } from '@azure/communication-chat';
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
  eventSubscriber: EventSubscriber;
}

const proxyChatClient: ProxyHandler<ChatClient> = {
  get: function <P extends keyof ChatClient>(
    chatClient: ChatClient,
    prop: P,
    receiver: DeclarativeChatClientWithPrivateProps
  ) {
    const context = receiver.context;
    switch (prop) {
      case 'createChatThread': {
        return async function (...args: Parameters<ChatClient['createChatThread']>) {
          return chatClient.createChatThread(...args);
        };
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
          receiver.eventSubscriber = new EventSubscriber(chatClient, context);
          return ret;
        };
      }
      case 'stopRealtimeNotifications': {
        return async function (...args: Parameters<ChatClient['stopRealtimeNotifications']>) {
          const ret = await chatClient.stopRealtimeNotifications(...args);
          receiver.eventSubscriber.unsubscribe();
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

  Object.defineProperty(chatClient, 'context', {
    configurable: false,
    get: () => context
  });

  Object.defineProperty(chatClient, 'eventSubscriber', {
    configurable: false,
    get: () => eventSubscriber,
    set: (val: EventSubscriber) => {
      eventSubscriber = val;
    }
  });

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
