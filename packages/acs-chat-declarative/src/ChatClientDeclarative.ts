// © Microsoft Corporation. All rights reserved.
import { ChatClient } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { ChatClientState } from './ChatClientState';
import { EventSubscriber } from './EventSubscriber';
import { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';
import { enableMapSet } from 'immer';

enableMapSet();

export interface DeclarativeChatClient extends ChatClient {
  state: ChatClientState;
  onStateChange(handler: (state: ChatClientState) => void): void;
}

const context: ChatContext = new ChatContext();

const proxyChatClient: ProxyHandler<ChatClient> = {
  get: function <P extends keyof ChatClient>(target: ChatClient, prop: P) {
    switch (prop) {
      case 'createChatThread': {
        // Do we want to let developer to declaratify this?
        return async function (...args: Parameters<ChatClient['createChatThread']>) {
          const chatThreadClient = await target.createChatThread(...args);
          return chatThreadClientDeclaratify(chatThreadClient, context);
        };
      }
      case 'getChatThreadClient': {
        // Do we want to let developer to declaratify this?
        return async function (...args: Parameters<ChatClient['getChatThreadClient']>) {
          const chatThreadClient = await target.getChatThreadClient(...args);
          return chatThreadClientDeclaratify(chatThreadClient, context);
        };
      }
      case 'startRealtimeNotifications': {
        return async function (...args: Parameters<ChatClient['startRealtimeNotifications']>) {
          const ret = await target.startRealtimeNotifications(...args);
          new EventSubscriber(target, context);
          return ret;
        };
      }
      default:
        return Reflect.get(target, prop);
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
