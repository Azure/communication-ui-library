// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

export interface Identifiers {
  /** `data-ui-id` value for `SendBox` Component */
  sendboxTextfield: string;
  /** `data-ui-id` value for `ParticipantList` Component */
  participantList: string;
  /** `data-ui-id` value for `MessageThread` components message content */
  messageContent: string;
  /** `data-ui-id` value for `MessageThread` components message timestamp */
  messageTimestamp: string;
  /** `data-ui-id` value for `TypingIndicator` Component */
  typingIndicator: string;
  /** `data-ui-id` value for `VideoGallery` Component */
  videoGallery: string;
}

/**
 * Default `data-ui-id` values for components.
 * These values are assigned to the root element of a component through a
 * custom html attribute `data-ui-id`
 */
export const defaultIdentifiers: Identifiers = {
  sendboxTextfield: 'sendbox-textfield',
  participantList: 'participant-list',
  messageContent: 'message-content',
  messageTimestamp: 'message-timestamp',
  typingIndicator: 'typing-indicator',
  videoGallery: 'video-gallery'
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
