// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from 'chat-stateful-client';
import { ParticipantList } from 'react-components';
import { useChatSelector } from '@azure/communication-react';

import React from 'react';
import { useHandlers } from './useHandlers';
import { ChatHeader } from '../ChatHeader';
import { chatParticipantListSelector } from '../selectors/chatParticipantListSelector';
import { chatHeaderSelector } from '../selectors/chatHeaderSelector';

type Selector = (state: ChatClientState, props: any) => any;
export const usePropsFor = <SelectorT extends (state: ChatClientState, props: any) => any>(
  component: React.FunctionComponent<any>
): ReturnType<SelectorT> => {
  const selector = getSelector(component);
  return { ...useChatSelector(selector), ...useHandlers(component) };
};

export const getSelector = (component: React.FunctionComponent<any>): Selector => {
  switch (component) {
    case ParticipantList:
      return chatParticipantListSelector;
    case ChatHeader:
      return chatHeaderSelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};
