// © Microsoft Corporation. All rights reserved.

import { ChatClientState } from '@azure/acs-chat-declarative';
import { chatThreadSelector, sendBoxSelector, typingIndicatorSelector } from '@azure/acs-chat-selector';
import { MessageThread, SendBox, TypingIndicator } from '@azure/communication-ui';

import React from 'react';
import { useSelector } from './useSelector';

// This takes in a Component from our
type Selector = (state: ChatClientState, props: any) => any;
export const useProps = <SelectorT extends (state: ChatClientState, props: any) => any>(
  component: React.FunctionComponent<any>
): ReturnType<SelectorT> => {
  const selector = getSelector(component);
  return useSelector(selector);
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
  throw 'Can\'t find the right selector for this component. Please check supported Feature component from Azure Communication UI Feature Component list.';
};
