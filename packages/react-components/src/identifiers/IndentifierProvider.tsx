// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

export interface Identifiers {
  sendboxTextfield: string;
  participantList: string;
  messageContent: string;
  messageTimestamp: string;
}

export const defaultIdentifiers: Identifiers = {
  sendboxTextfield: 'sendbox-textfield',
  participantList: 'participant-list',
  messageContent: 'message-content',
  messageTimestamp: 'message-timestamp'
};

export const IdentifierContext = createContext<Identifiers>(defaultIdentifiers);

export interface IdentifierProviderProps {
  identifiers?: Identifiers;
  children: React.ReactNode;
}

export const IdentifierProvider = (props: IdentifierProviderProps): JSX.Element => {
  const { identifiers, children } = props;
  return <IdentifierContext.Provider value={identifiers ?? defaultIdentifiers}>{children}</IdentifierContext.Provider>;
};

export const useIdentifiers = (): Identifiers => useContext(IdentifierContext);
