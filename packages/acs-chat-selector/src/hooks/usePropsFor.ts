// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { MessageThread, SendBox, TypingIndicator } from 'react-components';

import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { sendBoxSelector } from '../sendBoxSelector';
import { chatThreadSelector } from '../chatThreadSelector';
import { typingIndicatorSelector } from '../typingIndicatorSelector';
// @ts-ignore
import { CommonProperties } from 'acs-ui-common';
// @ts-ignore
import { Common, DefaultChatHandlers } from '../handlers/createHandlers';

export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): ReturnType<GetSelector<Component>> & Common<DefaultChatHandlers, Parameters<Component>[0]> => {
  const selector = getSelector(component);
  return { ...useSelector(selector), ...useHandlers<Parameters<Component>[0]>(component) };
};

export type GetSelector<Component> = AreEqual<Component, typeof SendBox> extends true
  ? typeof sendBoxSelector
  : AreEqual<Component, typeof MessageThread> extends true
  ? typeof chatThreadSelector
  : AreEqual<Component, typeof TypingIndicator> extends true
  ? typeof typingIndicatorSelector
  : never;

export type AreEqual<A, B> = A extends B ? (B extends A ? true : false) : false;

export const getSelector = <Component extends (props: any) => JSX.Element | undefined>(
  component: Component
): GetSelector<Component> => {
  return findSelector(component);
};

const findSelector = (component: (props: any) => JSX.Element | undefined): any => {
  switch (component) {
    case SendBox:
      return sendBoxSelector;
    case MessageThread:
      return chatThreadSelector;
    case TypingIndicator:
      return typingIndicatorSelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};
