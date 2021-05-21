// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { MessageThread, ParticipantList, SendBox, TypingIndicator } from 'react-components';

import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { sendBoxSelector } from '../sendBoxSelector';
import { chatThreadSelector } from '../chatThreadSelector';
import { typingIndicatorSelector } from '../typingIndicatorSelector';
import { Common } from 'acs-ui-common';
// @ts-ignore
import { CommonProperties, AreEqual } from 'acs-ui-common';
// @ts-ignore
import { DefaultChatHandlers } from '../handlers/createHandlers';
import { chatParticipantListSelector } from '../chatParticipantListSelector';

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
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};
