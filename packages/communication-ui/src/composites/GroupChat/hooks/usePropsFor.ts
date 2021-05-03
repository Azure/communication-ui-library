// © Microsoft Corporation. All rights reserved.

import { ChatClientState } from '@azure/acs-chat-declarative';
import { chatThreadSelector, sendBoxSelector, typingIndicatorSelector } from '@azure/acs-chat-selector';
import { MessageThread, SendBox, TypingIndicator } from '../../../components';

import React from 'react';
import { useHandlers } from './useHandlers';
import { useAdaptedSelector } from './useAdaptedSelector';

type Selector = (state: ChatClientState, props: any) => any;
export const usePropsFor = <SelectorT extends (state: ChatClientState, props: any) => any>(
  component: React.FunctionComponent<any>
): ReturnType<SelectorT> => {
  const selector = getSelector(component);
  return { ...useAdaptedSelector(selector), ...useHandlers(component) };
};

export const getSelector = (component: React.FunctionComponent<any>): Selector => {
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
