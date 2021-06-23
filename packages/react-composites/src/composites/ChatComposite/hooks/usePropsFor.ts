// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getChatSelector, DefaultChatHandlers, GetChatSelector } from 'chat-component-bindings';

import { useHandlers } from './useHandlers';
import { useAdaptedSelector } from './useAdaptedSelector';
import { Common } from 'acs-ui-common';

type Selector = (state: any, props: any) => any;

export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): GetChatSelector<Component> extends Selector
  ? ReturnType<GetChatSelector<Component>> & Common<DefaultChatHandlers, Parameters<Component>[0]>
  : {} => {
  const selector = getChatSelector(component);
  if (!selector) {
    throw new Error("Can't find the selector for component, please check supported component list");
  }
  return { ...useAdaptedSelector(selector as Selector), ...useHandlers(component) };
};
