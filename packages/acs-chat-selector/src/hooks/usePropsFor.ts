// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from 'chat-stateful-client';
import { MessageThread, SendBox, TypingIndicator } from 'react-components';

import React from 'react';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { sendBoxSelector } from '../sendBoxSelector';
import { chatThreadSelector } from '../chatThreadSelector';
import { typingIndicatorSelector } from '../typingIndicatorSelector';

type Selector = (state: ChatClientState, props: any) => any;
export const usePropsFor = <SelectorT extends (state: ChatClientState, props: any) => any>(
  component: React.FunctionComponent<any>
): ReturnType<SelectorT> => {
  const selector = getSelector(component);
  return { ...useSelector(selector), ...useHandlers(component) };
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
