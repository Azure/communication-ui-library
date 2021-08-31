// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ErrorBar, MessageThread, ParticipantList, SendBox, TypingIndicator } from '@internal/react-components';

import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { sendBoxSelector } from '../sendBoxSelector';
import { messageThreadSelector } from '../messageThreadSelector';
import { typingIndicatorSelector } from '../typingIndicatorSelector';
import { Common, AreEqual } from '@internal/acs-ui-common';
import { ChatHandlers } from '../handlers/createHandlers';
import { chatParticipantListSelector } from '../chatParticipantListSelector';
import { errorBarSelector } from '../errorBarSelector';

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

export type GetSelector<Component extends (props: any) => JSX.Element | undefined> = AreEqual<
  Component,
  typeof SendBox
> extends true
  ? typeof sendBoxSelector
  : AreEqual<Component, typeof MessageThread> extends true
  ? typeof messageThreadSelector
  : AreEqual<Component, typeof TypingIndicator> extends true
  ? typeof typingIndicatorSelector
  : AreEqual<Component, typeof ParticipantList> extends true
  ? typeof chatParticipantListSelector
  : AreEqual<Component, typeof ErrorBar> extends true
  ? typeof errorBarSelector
  : undefined;

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
