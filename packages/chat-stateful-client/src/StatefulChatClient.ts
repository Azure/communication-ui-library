// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatClientOptions } from '@azure/communication-chat';
import { _getApplicationId } from '@internal/acs-ui-common';
import { ChatContext } from './ChatContext';
import { ChatClientState } from './ChatClientState';
import { EventSubscriber } from './EventSubscriber';
import { chatThreadClientDeclaratify } from './StatefulChatThreadClient';
import { createDecoratedListThreads } from './iterators/createDecoratedListThreads';
import { CommunicationIdentifierKind, CommunicationTokenCredential } from '@azure/communication-common';

/**
 * Defines the methods that allow {@Link @azure/communication-chat#ChatClient} to be used with a centralized generated state.
 *
 * The interface provides access to proxied state and also allows registering a handler for state change events.
 *
 * @public
 */
export interface StatefulChatClient extends ChatClient {
  /**
   * Holds all the state that we could proxy from ChatClient {@Link @azure/communication-chat#ChatClient} as
   * ChatClientState {@Link ChatClientState}.
   */
  getState(): ChatClientState;
  /**
   * Allows a handler to be registered for 'stateChanged' events.
   *
   * @param handler - Callback to receive the state.
   */
  onStateChange(handler: (state: ChatClientState) => void): void;
  /**
   * Allows unregistering for 'stateChanged' events.
   *
   * @param handler - Original callback to be unsubscribed.
   */
  offStateChange(handler: (state: ChatClientState) => void): void;
}

interface StatefulChatClientWithPrivateProps extends StatefulChatClient {
  context: ChatContext;
  eventSubscriber: EventSubscriber | undefined;
}

const proxyChatClient: ProxyHandler<ChatClient> = {
  get: function <P extends keyof StatefulChatClientWithPrivateProps>(
    chatClient: ChatClient,
    prop: P,
    receiver: StatefulChatClientWithPrivateProps
  ) {
    // skip receiver.context call to avoid recursive bugs
    if (prop === 'context') {
      return Reflect.get(chatClient, prop);
    }

    const context = receiver.context;
    switch (prop) {
      case 'createChatThread': {
        return context.withAsyncErrorTeedToState(async function (...args: Parameters<ChatClient['createChatThread']>) {
          const result = await chatClient.createChatThread(...args);
          const thread = result.chatThread;
          if (thread) {
            const [request] = args;
            context.createThread(thread.id, { topic: request.topic });
          }
          return result;
        }, 'ChatClient.createChatThread');
      }

      case 'deleteChatThread': {
        return context.withAsyncErrorTeedToState(async function (...args: Parameters<ChatClient['deleteChatThread']>) {
          const result = await chatClient.deleteChatThread(...args);
          context.deleteThread(args[0]);
          return result;
        }, 'ChatClient.deleteChatThread');
      }
      case 'listChatThreads': {
        return createDecoratedListThreads(chatClient, context);
      }
      case 'getChatThreadClient': {
        return function (...args: Parameters<ChatClient['getChatThreadClient']>) {
          const chatThreadClient = chatClient.getChatThreadClient(...args);
          // TODO(prprabhu): Ensure that thread properties are fetched into the ChatContext at this point.
          // A new thread might be created here, but the properties will never be fetched.
          return chatThreadClientDeclaratify(chatThreadClient, context);
        };
      }
      case 'startRealtimeNotifications': {
        return context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<ChatClient['startRealtimeNotifications']>
        ) {
          const ret = await chatClient.startRealtimeNotifications(...args);
          if (!receiver.eventSubscriber) {
            receiver.eventSubscriber = new EventSubscriber(chatClient, context);
          }
          return ret;
        },
        'ChatClient.startRealtimeNotifications');
      }
      case 'stopRealtimeNotifications': {
        return context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<ChatClient['stopRealtimeNotifications']>
        ) {
          const ret = await chatClient.stopRealtimeNotifications(...args);
          if (receiver.eventSubscriber) {
            receiver.eventSubscriber.unsubscribe();
            receiver.eventSubscriber = undefined;
          }
          return ret;
        },
        'ChatClient.stopRealtimeNotifications');
      }
      default:
        return Reflect.get(chatClient, prop);
    }
  }
};

/**
 * Arguments to construct the {@link StatefulChatClient}.
 *
 * @public
 */
export type StatefulChatClientArgs = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  endpoint: string;
  credential: CommunicationTokenCredential;
};

/**
 * Options to construct the {@link StatefulChatClient}.
 *
 * @public
 */
export type StatefulChatClientOptions = {
  /**
   * Options to construct the {@link @azure/communication-chat#ChatClient} with.
   */
  chatClientOptions: ChatClientOptions;
  /**
   * Sets the max listeners limit of the 'stateChange' event. Defaults to the node.js EventEmitter.defaultMaxListeners
   * if not specified.
   */
  maxStateChangeListeners?: number;
};

/**
 * Creates a stateful ChatClient {@link StatefulChatClient} by proxying ChatClient
 * {@link @azure/communication-chat#ChatClient} with ProxyChatClient {@link ProxyChatClient} which then allows access
 * to state in a declarative way.
 *
 * @public
 */
export const createStatefulChatClient = (
  args: StatefulChatClientArgs,
  options?: StatefulChatClientOptions
): StatefulChatClient => {
  const tweakedOptions = {
    ...options,
    chatClientOptions: {
      ...options?.chatClientOptions,
      userAgentOptions: { userAgentPrefix: _getApplicationId() }
    }
  };
  return createStatefulChatClientWithDeps(
    new ChatClient(args.endpoint, args.credential, tweakedOptions.chatClientOptions),
    args,
    tweakedOptions
  );
};

/**
 * A function to modify the state of the StatefulChatClient.
 *
 * Provided as a callback to the {@link StatefulChatClient.modifyState} method.
 *
 * The function must modify the provided state in place as much as possible.
 * Making large modifications can lead to bad performance by causing spurious rerendering of the UI.
 *
 * Consider using commonly used modifier functions exported from this package.
 */
export type ChatStateModifier = (state: ChatClientState) => void;

/**
 * Internal implementation of {@link createStatefulChatClient} for dependency injection.
 *
 * Used by tests. Should not be exported out of this package.
 */
export const createStatefulChatClientWithDeps = (
  chatClient: ChatClient,
  args: StatefulChatClientArgs,
  options?: StatefulChatClientOptions
): StatefulChatClient => {
  const context = new ChatContext(options?.maxStateChangeListeners);
  let eventSubscriber: EventSubscriber;

  context.updateChatConfig(args.userId, args.displayName);

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

  Object.defineProperty(proxy, 'getState', {
    configurable: false,
    value: () => context?.getState()
  });
  Object.defineProperty(proxy, 'onStateChange', {
    configurable: false,
    value: (handler: (state: ChatClientState) => void) => context?.onStateChange(handler)
  });
  Object.defineProperty(proxy, 'offStateChange', {
    configurable: false,
    value: (handler: (state: ChatClientState) => void) => context?.offStateChange(handler)
  });

  return proxy as StatefulChatClient;
};
