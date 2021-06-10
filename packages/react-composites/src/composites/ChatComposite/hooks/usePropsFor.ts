// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getChatSelector, DefaultChatHandlers, GetChatSelector } from 'chat-component-bindings';

import { useHandlers } from './useHandlers';
import { useAdaptedSelector } from './useAdaptedSelector';
import { Common } from 'acs-ui-common';

export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): ReturnType<GetChatSelector<Component>> & Common<DefaultChatHandlers, Parameters<Component>[0]> => {
  const selector = getChatSelector(component);
  return { ...useAdaptedSelector(selector), ...useHandlers(component) };
};
