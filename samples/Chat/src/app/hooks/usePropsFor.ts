// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from 'chat-stateful-client';
import { ParticipantList } from 'react-components';
import { chatParticipantListSelector } from '../selectors/chatParticipantListSelector';

import React from 'react';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';

type Selector = (state: ChatClientState, props: any) => any;
export const usePropsFor = <SelectorT extends (state: ChatClientState, props: any) => any>(
  component: React.FunctionComponent<any>
): ReturnType<SelectorT> => {
  const selector = getSelector(component);
  return { ...useSelector(selector), ...useHandlers(component) };
};

export const getSelector = (component: React.FunctionComponent<any>): Selector => {
  switch (component) {
    case ParticipantList:
      return chatParticipantListSelector;
  }
  throw 'Can\'t find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.';
};
