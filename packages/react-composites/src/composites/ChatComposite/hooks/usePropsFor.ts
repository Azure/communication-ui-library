// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getChatSelector, ChatHandlers, GetChatSelector } from '@internal/chat-component-bindings';

import { useHandlers } from './useHandlers';
import { useAdaptedSelector } from './useAdaptedSelector';
import { Common } from '@internal/acs-ui-common';

type Selector = (state: any, props: any) => any;

/**
 * @private
 */
export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): GetChatSelector<Component> extends Selector
  ? ReturnType<GetChatSelector<Component>> & Common<ChatHandlers, Parameters<Component>[0]>
  : Record<string, never> => {
  const selector = getChatSelector(component);
  if (!selector) {
    throw new Error("Can't find the selector for component, please check supported component list");
  }
  return { ...useAdaptedSelector(selector as Selector), ...useHandlers(component) };
};
