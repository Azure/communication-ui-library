// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  DefaultCallingHandlers,
  getCallingSelector,
  GetCallingSelector,
  useCallingHandlers,
  useCallingSelector
} from 'calling-component-bindings';
import {
  DefaultChatHandlers,
  getChatSelector,
  GetChatSelector,
  useChatHandlers,
  useChatSelector
} from 'chat-component-bindings';
import { ChatClientState } from 'chat-stateful-client';
import { CallClientState } from 'calling-stateful-client';
import { Common } from 'acs-ui-common';

export type ClientState = CallClientState & ChatClientState;
export type Selector = (state: ClientState, props: any) => any;

// Because of react hooks rules, hooks can't be conditionally called
// We call both call and chat hooks and detect current context
// Return undefined and skip execution when not in that context
export const useSelector = <ParamT extends Selector | undefined>(
  selector: ParamT,
  selectorProps?: ParamT extends Selector ? Parameters<ParamT>[1] : undefined
): ParamT extends Selector ? ReturnType<ParamT> : undefined => {
  const callProps = useCallingSelector(selector as any, selectorProps);
  const chatProps = useChatSelector(selector as any, selectorProps);
  return callProps ?? chatProps;
};

export type ChatReturnProps<Component extends (props: any) => JSX.Element> = GetChatSelector<Component> extends (
  state: ChatClientState,
  props: any
) => any
  ? ReturnType<GetChatSelector<Component>> & Common<DefaultChatHandlers, Parameters<Component>[0]>
  : never;

export type CallingReturnProps<Component extends (props: any) => JSX.Element> = GetCallingSelector<Component> extends (
  state: CallClientState,
  props: any
) => any
  ? ReturnType<GetCallingSelector<Component>> & Common<DefaultCallingHandlers, Parameters<Component>[0]>
  : never;

export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component,
  type?: 'calling' | 'chat'
): ChatReturnProps<Component> extends never
  ? CallingReturnProps<Component> extends never
    ? undefined
    : CallingReturnProps<Component>
  : ChatReturnProps<Component> => {
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

  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};
