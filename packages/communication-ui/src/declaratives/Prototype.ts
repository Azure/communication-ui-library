// © Microsoft Corporation. All rights reserved.
import { ChatMessage, ChatThreadClient, ListPageSettings } from '@azure/communication-chat';
import { ChatMessage as WebUiChatMessage, MessageStatus } from '../types/ChatMessage';
import { produce, enableMapSet } from 'immer';
import EventEmitter from 'events';

enableMapSet();

/**
 * Implementation agnostic state, not associated with ACS types.
 */
export interface ChatThreadState {
  // Use a map for efficient updating but should output iterator or array (maybe change to class and add getMessages())
  chatMessages: Map<string, WebUiChatMessage>;
}

/**
 * Interface for getState and onStateChange.
 */
export interface Declarative<T> {
  getState: () => T;
  onStateChange(handler: (state: T) => void): void;
}

/**
 * Interface that extends ChatThreadClient and Declarative. This provides a type that contains both the ChatThreadClient
 * methods and also getState and onStateChange.
 */
export type DeclarativeChatThreadClient = ChatThreadClient & Declarative<ChatThreadState>;

/**
 * Proxies chatThreadClient.listMessages() and updates the proxied state via getState and setState by wrapping the
 * returned iterators.
 *
 * @param chatThreadClient
 * @param getState
 * @param setState
 */
const proxyListMessages = (
  chatThreadClient: ChatThreadClient,
  getState: () => ChatThreadState,
  setState: (state: ChatThreadState) => void
) => {
  return (...args: Parameters<ChatThreadClient['listMessages']>) => {
    const messages = chatThreadClient.listMessages(...args);
    return {
      next() {
        return new Promise<IteratorResult<ChatMessage, ChatMessage>>((resolve) => {
          messages.next().then((result) => {
            if (!result.done && result.value) {
              const message: ChatMessage = result.value;
              setState(
                produce(getState(), (draft) => {
                  if (message.id) {
                    draft.chatMessages.set(message.id, {
                      messageId: message.id,
                      content: message.content,
                      createdOn: message.createdOn,
                      senderId: message.sender?.communicationUserId,
                      senderDisplayName: message.senderDisplayName,
                      status: MessageStatus.DELIVERED // TODO: need to merge with read receipts for proper status
                    });
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
                      setState(
                        produce(getState(), (draft) => {
                          draft.chatMessages.set(message.id, {
                            messageId: message.id,
                            content: message.content,
                            createdOn: message.createdOn,
                            senderId: message.sender?.communicationUserId,
                            senderDisplayName: message.senderDisplayName,
                            status: MessageStatus.DELIVERED // TODO: need to merge with read receipts for proper status
                          });
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

/**
 * Proxies ChatThreadClient and stores the state internally. Provides access to state via getState and onStateChange.
 */
class ProxyChatThreadClientDeclarative implements ProxyHandler<ChatThreadClient>, Declarative<ChatThreadState> {
  private _state: ChatThreadState;
  private _emitter: EventEmitter = new EventEmitter();

  constructor() {
    this._state = {
      chatMessages: new Map<string, WebUiChatMessage>()
    };
  }

  private setState(state: ChatThreadState): void {
    this._state = state;
    this._emitter.emit('stateChanged', this._state);
  }

  public getState(): ChatThreadState {
    return this._state;
  }

  public onStateChange(handler: (state: ChatThreadState) => void): void {
    this._emitter.on('stateChanged', handler);
  }

  public get<P extends keyof ChatThreadClient>(target: ChatThreadClient, prop: P): any {
    switch (prop) {
      case 'listMessages': {
        return proxyListMessages(target, this.getState.bind(this), this.setState.bind(this));
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Helper function that creates a DeclarativeChatThreadClient which proxies the given ChatThreadClient.
 *
 * @param chatThreadClient
 */
export const createDeclarativeChatThreadClient = (chatThreadClient: ChatThreadClient): DeclarativeChatThreadClient => {
  const proxyChatThreadClient = new ProxyChatThreadClientDeclarative();
  Object.defineProperty(chatThreadClient, 'getState', {
    value: () => proxyChatThreadClient.getState()
  });
  Object.defineProperty(chatThreadClient, 'onStateChange', {
    value: (handler: (state: ChatThreadState) => void) => proxyChatThreadClient.onStateChange(handler)
  });
  return new Proxy(chatThreadClient, proxyChatThreadClient) as DeclarativeChatThreadClient;
};

/**
- Usage:

const declarativeChatThreadClient = createDeclarativeChatThreadClient(chatClient.createChatThread());
declarativeChatThreadClient.onStateChange((state: ChatThreadState) => console.log('onStateChange', state));
console.log('getState', declarativeChatThreadClient.getState());
*/
