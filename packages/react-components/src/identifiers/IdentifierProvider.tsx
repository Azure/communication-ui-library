// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

/**
 * Identifiers that can be used to target specific components in a composite.
 *
 * @experimental
 *
 * These identifiers are assigned as `data-ui-id` HTML attribute of the root element of the targeted component.
 *
 * This API is intended for end to end test automation. As such, they are not covered by the API
 * guarantee of the public API. This will remain perenially experimental and compatibility breaking changes
 * may be made at any point.
 *
 * @public
 */
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
  /** `data-ui-id` value for `VideoTile` Component */
  videoTile: string;
}

const defaultIdentifiers: Identifiers = {
  sendboxTextfield: 'sendbox-textfield',
  participantList: 'participant-list',
  messageContent: 'message-content',
  messageTimestamp: 'message-timestamp',
  typingIndicator: 'typing-indicator',
  videoGallery: 'video-gallery',
  videoTile: 'video-tile'
};

export const IdentifierContext = createContext<Identifiers>(defaultIdentifiers);

/**
 * Arguments to Context Provider for {@link Identifiers}.
 *
 * @experimental
 *
 * See documentation for {@link Identifiers}.
 *
 * @beta
 */
export interface IdentifierProviderProps {
  identifiers?: Identifiers;
  children: React.ReactNode;
}

/**
 * React Context provider for {@link Identifiers}.
 *
 * @experimental
 *
 * See documentation for {@link Identifiers}.
 *
 * @beta
 */
export const IdentifierProvider = (props: IdentifierProviderProps): JSX.Element => {
  const { identifiers, children } = props;
  return <IdentifierContext.Provider value={identifiers ?? defaultIdentifiers}>{children}</IdentifierContext.Provider>;
};

export const useIdentifiers = (): Identifiers => useContext(IdentifierContext);
