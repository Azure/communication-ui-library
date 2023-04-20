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
  /** `data-ui-id` value for overflow gallery component's left navigation button */
  overflowGalleryLeftNavButton: string;
  /** `data-ui-id` value for overflow gallery component's right navigation button */
  overflowGalleryRightNavButton: string;
  /** `data-ui-id` value for the video tiles in the horizontal gallery */
  horizontalGalleryVideoTile: string;
  /* @conditional-compile-remove(vertical-gallery) */
  /** `data-ui-id` value for `VerticalGallery` Component's children video tiles */
  verticalGalleryVideoTile: string;
  /* @conditional-compile-remove(vertical-gallery) */
  /** `data-ui-id` value for `VerticalGallery` Component's page counter */
  verticalGalleryPageCounter: string;
  /** `data-ui-id` value for `MentionFlyout` Component's suggestion list */
  mentionSuggestionList: string;
  /** `data-ui-id` value for `MentionFlyout` Component's suggestion list item */
  mentionSuggestionItem: string;
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
  overflowGalleryLeftNavButton: 'overflow-gallery-left-nav-button',
  overflowGalleryRightNavButton: 'overflow-gallery-right-nav-button',
  /* @conditional-compile-remove(vertical-gallery) */
  verticalGalleryVideoTile: 'vertical-gallery-video-tile',
  horizontalGalleryVideoTile: 'horizontal-gallery-video-tile',
  /* @conditional-compile-remove(vertical-gallery) */
  verticalGalleryPageCounter: 'vertical-gallery-page-counter',
  mentionSuggestionList: 'mention-suggestion-list',
  mentionSuggestionItem: 'mention-suggestion-item'
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
