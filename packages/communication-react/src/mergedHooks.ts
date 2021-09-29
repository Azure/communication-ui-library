// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  CallingHandlers,
  getCallingSelector,
  GetCallingSelector,
  useCallingHandlers,
  useCallingSelector
} from '@internal/calling-component-bindings';
import {
  ChatHandlers,
  getChatSelector,
  GetChatSelector,
  useChatHandlers,
  useChatSelector
} from '@internal/chat-component-bindings';
import { ChatClientState } from '@internal/chat-stateful-client';
import { CallClientState } from '@internal/calling-stateful-client';
import { Common } from '@internal/acs-ui-common';

/**
 * Centralized state for {@link @azure/communication-calling#CallClient} or {@link @azure/communication-chat#ChatClient}.
 *
 * See also: {@link CallClientState}, {@link ChatClientState}.
 * @public
 */
export type ClientState = CallClientState & ChatClientState;

/**
 * An optimized selector that refines {@link ClientState} updates into props for React Components in this library.
 *
 * @public
 */
export type Selector = (state: ClientState, props: any) => any;

/**
 * Hook to obtain a selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useSelector = <ParamT extends Selector | undefined>(
  selector: ParamT,
  selectorProps?: ParamT extends Selector ? Parameters<ParamT>[1] : undefined,
  type?: 'calling' | 'chat'
): ParamT extends Selector ? ReturnType<ParamT> : undefined => {
  // Because of react hooks rules, hooks can't be conditionally called
  // We call both call and chat hooks and detect current context
  // Return undefined and skip execution when not in that context
  const callingMode = !type || type === 'calling';
  const chatMode = !type || type === 'chat';
  const callProps = useCallingSelector(callingMode ? (selector as any) : undefined, selectorProps);
  const chatProps = useChatSelector(chatMode ? (selector as any) : undefined, selectorProps);
  return callProps ?? chatProps;
};

/**
 * Helper type for {@link usePropsFor}.
 *
 * @public
 */
export type ChatReturnProps<Component extends (props: any) => JSX.Element> = GetChatSelector<Component> extends (
  state: ChatClientState,
  props: any
) => any
  ? ReturnType<GetChatSelector<Component>> & Common<ChatHandlers, Parameters<Component>[0]>
  : never;

/**
 * Helper type for {@link usePropsFor}.
 *
 * @public
 */
export type CallingReturnProps<Component extends (props: any) => JSX.Element> = GetCallingSelector<Component> extends (
  state: CallClientState,
  props: any
) => any
  ? ReturnType<GetCallingSelector<Component>> & Common<CallingHandlers, Parameters<Component>[0]>
  : never;

/**
 * Helper type for {@link usePropsFor}.
 *
 * @public
 */
export type ComponentProps<Component extends (props: any) => JSX.Element> = ChatReturnProps<Component> extends never
  ? CallingReturnProps<Component> extends never
    ? undefined
    : CallingReturnProps<Component>
  : ChatReturnProps<Component>;

/**
 * Primary hook to get all hooks necessary for a React Component from this library..
 *
 * Most straightforward usage of a components looks like:
 *
 * @example
 * ```
 *     import { ParticipantList, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <ParticipantList {...usePropsFor(ParticipantList)}/>
 *     }
 * ```
 *
 * @public
 */
export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component,
  type?: 'calling' | 'chat'
): ComponentProps<Component> => {
  const callingSelector = type === 'calling' || !type ? getCallingSelector(component) : undefined;
  const chatSelector = type === 'chat' || !type ? getChatSelector(component) : undefined;
  const callProps = useCallingSelector(callingSelector);
  const chatProps = useChatSelector(chatSelector);
  const callingHandlers = useCallingHandlers<Parameters<Component>[0]>(component);
  const chatHandlers = useChatHandlers<Parameters<Component>[0]>(component);

  if (chatProps) {
    if (!chatHandlers) {
      throw 'Please initialize chatClient and chatThreadClient first!';
    }
    return { ...chatProps, ...chatHandlers } as any;
  }

  if (callProps) {
    if (!callingHandlers) {
      throw 'Please initialize callClient first!';
    }
    return { ...callProps, ...callingHandlers } as any;
  }

  throw "Can't find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.";
};
