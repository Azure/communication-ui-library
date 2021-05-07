// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { GroupChatAdapter } from './GroupChatAdapter';

type ChatProviderProps = {
  children: React.ReactNode;
  adapter: GroupChatAdapter;
};

const GroupChatAdapterContext = createContext<GroupChatAdapter | undefined>(undefined);

export const GroupChatAdapterProvider = (props: ChatProviderProps): JSX.Element => {
  const { adapter } = props;
  return <GroupChatAdapterContext.Provider value={adapter}>{props.children}</GroupChatAdapterContext.Provider>;
};

export const useAdapter = (): GroupChatAdapter => {
  const adapter = useContext(GroupChatAdapterContext);
  if (!adapter) throw 'Cannot find adapter please initialize before usage.';
  return adapter;
};
