// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { MessageThread, ParticipantList, SendBox, TypingIndicator } from 'react-components';

import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { sendBoxSelector } from '../sendBoxSelector';
import { chatThreadSelector } from '../chatThreadSelector';
import { typingIndicatorSelector } from '../typingIndicatorSelector';
import { Common, AreEqual } from '@internal/acs-ui-common';
import { DefaultChatHandlers } from '../handlers/createHandlers';
import { chatParticipantListSelector } from '../chatParticipantListSelector';

export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): GetSelector<Component> extends (props: any) => any
  ? ReturnType<GetSelector<Component>> & Common<DefaultChatHandlers, Parameters<Component>[0]>
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
  ? typeof chatThreadSelector
  : AreEqual<Component, typeof TypingIndicator> extends true
  ? typeof typingIndicatorSelector
  : AreEqual<Component, typeof ParticipantList> extends true
  ? typeof chatParticipantListSelector
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
      return chatThreadSelector;
    case TypingIndicator:
      return typingIndicatorSelector;
    case ParticipantList:
      return chatParticipantListSelector;
  }
  return undefined;
};
