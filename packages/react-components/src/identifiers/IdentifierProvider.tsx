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
 * @internal
 */
export interface _Identifiers {
  /** `data-ui-id` value for `SendBox` Component */
  sendboxTextField: string;
  /** `data-ui-id` value for `ParticipantButton` Component's People menu item */
  participantButtonPeopleMenuItem: string;
  /** `data-ui-id` value for `ParticipantItem` Component's Menu button */
  participantItemMenuButton: string;
  /** `data-ui-id` value for `ParticipantList` Component */
  participantList: string;
  /** `data-ui-id` value for `ParticipantList` Component's People Button */
  participantListPeopleButton: string;
  /** `data-ui-id` value for `ParticipantList` Component's Remove Participant Button */
  participantListRemoveParticipantButton: string;
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
  /** `data-ui-id` value for `HorizontalGallery` Component's left navigation button */
  horizontalGalleryLeftNavButton: string;
  /** `data-ui-id` value for `HorizontalGallery` Component's right navigation button */
  horizontalGalleryRightNavButton: string;
  /** `data-ui-id` value for `VerticalGallery` Component's left navigation button */
  verticalGalleryLeftButton: string;
  /** `data-ui-id` value for `VerticalGallery` Component's right navigation button */
  verticalGalleryRightButton: string;
  /** `data-ui-id` value for `VerticalGallery` Component's page counter */
  verticalGalleryPageCounter: string;
  /** `data-ui-id` value for `VerticalGallery` Component's children video tiles */
  verticalGalleryVideoTile: string;
}

const defaultIdentifiers: _Identifiers = {
  sendboxTextField: 'sendbox-textfield',
  participantButtonPeopleMenuItem: 'participant-button-people-menu-item',
  participantItemMenuButton: 'participant-item-menu-button',
  participantList: 'participant-list',
  participantListPeopleButton: 'participant-list-people-button',
  participantListRemoveParticipantButton: 'participant-list-remove-participant-button',
  messageContent: 'message-content',
  messageTimestamp: 'message-timestamp',
  typingIndicator: 'typing-indicator',
  videoGallery: 'video-gallery',
  videoTile: 'video-tile',
  horizontalGalleryLeftNavButton: 'horizontal-gallery-left-nav-button',
  horizontalGalleryRightNavButton: 'horizontal-gallery-right-nav-button',
  verticalGalleryLeftButton: 'vertical-gallery-left-nav-button',
  verticalGalleryRightButton: 'vertical-gallery-right-nav-button',
  verticalGalleryPageCounter: 'vertical-gallery-page-counter',
  verticalGalleryVideoTile: 'vertical-gallery-video-tile'
};

/**
 * @private
 */
export const IdentifierContext = createContext<_Identifiers>(defaultIdentifiers);

/**
 * Arguments to Context Provider for {@link _Identifiers}.
 *
 * @experimental
 *
 * See documentation for {@link _Identifiers}.
 *
 * @internal
 */
export interface _IdentifierProviderProps {
  identifiers?: _Identifiers;
  children: React.ReactNode;
}

/**
 * React Context provider for {@link _Identifiers}.
 *
 * @experimental
 *
 * See documentation for {@link _Identifiers}.
 *
 * @internal
 */
export const _IdentifierProvider = (props: _IdentifierProviderProps): JSX.Element => {
  const { identifiers, children } = props;
  return <IdentifierContext.Provider value={identifiers ?? defaultIdentifiers}>{children}</IdentifierContext.Provider>;
};

/**
 * @private
 */
export const useIdentifiers = (): _Identifiers => useContext(IdentifierContext);
