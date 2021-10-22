// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ErrorBar, MessageThread, ParticipantList, SendBox, TypingIndicator } from '@internal/react-components';

import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { SendBoxSelector, sendBoxSelector } from '../sendBoxSelector';
import { MessageThreadSelector, messageThreadSelector } from '../messageThreadSelector';
import { TypingIndicatorSelector, typingIndicatorSelector } from '../typingIndicatorSelector';
import { Common, AreEqual } from '@internal/acs-ui-common';
import { ChatHandlers } from '../handlers/createHandlers';
import { ChatParticipantListSelector, chatParticipantListSelector } from '../chatParticipantListSelector';
import { ErrorBarSelector, errorBarSelector } from '../errorBarSelector';

/**
 * Primary hook to get all hooks necessary for a chat Component.
 *
 * Most straightforward usage of chat components looks like:
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
  component: Component
): GetSelector<Component> extends (props: any) => any
  ? ReturnType<GetSelector<Component>> & Common<ChatHandlers, Parameters<Component>[0]>
  : undefined => {
  const selector = getSelector(component);
  const props = useSelector(selector);
  const handlers = useHandlers<Parameters<Component>[0]>(component);
  if (props !== undefined) {
    return { ...props, ...handlers } as any;
  }
  return undefined as any;
};

/**
 * Specific type of the selector applicable to a given Component.
 *
 * @public
 */
export type GetSelector<Component extends (props: any) => JSX.Element | undefined> = AreEqual<
  Component,
  typeof SendBox
> extends true
  ? SendBoxSelector
  : AreEqual<Component, typeof MessageThread> extends true
  ? MessageThreadSelector
  : AreEqual<Component, typeof TypingIndicator> extends true
  ? TypingIndicatorSelector
  : AreEqual<Component, typeof ParticipantList> extends true
  ? ChatParticipantListSelector
  : AreEqual<Component, typeof ErrorBar> extends true
  ? ErrorBarSelector
  : undefined;

/**
 * Get the selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
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
      return messageThreadSelector;
    case TypingIndicator:
      return typingIndicatorSelector;
    case ParticipantList:
      return chatParticipantListSelector;
    case ErrorBar:
      return errorBarSelector;
  }
  return undefined;
};
