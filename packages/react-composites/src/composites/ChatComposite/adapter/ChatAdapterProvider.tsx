// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { ChatAdapter } from './ChatAdapter';

type ChatProviderProps = {
  children: React.ReactNode;
  adapter: ChatAdapter;
};

const ChatAdapterContext = createContext<ChatAdapter | undefined>(undefined);

export const ChatAdapterProvider = (props: ChatProviderProps): JSX.Element => {
  const { adapter } = props;
  return <ChatAdapterContext.Provider value={adapter}>{props.children}</ChatAdapterContext.Provider>;
};

export const useAdapter = (): ChatAdapter => {
  const adapter = useContext(ChatAdapterContext);
  if (!adapter) throw 'Cannot find adapter please initialize before usage.';
  return adapter;
};
