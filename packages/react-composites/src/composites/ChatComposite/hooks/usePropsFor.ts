// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from 'chat-stateful-client';
import {
  chatThreadSelector,
  chatParticipantListSelector,
  sendBoxSelector,
  typingIndicatorSelector
} from 'chat-component-bindings';
import { MessageThread, ParticipantList, SendBox, TypingIndicator } from 'react-components';

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
    case MessageThread:
      return chatThreadSelector;
    case ParticipantList:
      return chatParticipantListSelector;
    case SendBox:
      return sendBoxSelector;
    case TypingIndicator:
      return typingIndicatorSelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};
