// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';

/* @conditional-compile-remove(at-mention) */
/**
 * Props for {@link _AtMentionFlyout}.
 *
 * @internal
 */
export interface _AtMentionFlyoutProps {
  /**
   * Optional string used as a query to search for mentioned participants.
   */
  query?: string;
  /**
   * Optional RefObject used as a reference to position AtMentionFlyout.
   */
  target?: React.RefObject<Element>;
  /**
   * Callback to invoke when the error bar is dismissed
   */
  onDismiss?: () => void;
  /**
   * Optional props needed to lookup suggestions in the at mention scenario.
   */
  atMentionLookupOptions?: AtMentionLookupOptions;
}

/* @conditional-compile-remove(at-mention) */
/**
 * Options to lookup suggestions in the at mention scenario.
 *
 * @beta
 */
export interface AtMentionLookupOptions {
  /**
   * Optional string to set trigger keyword for mention a specific participant.
   *
   * @defaultValue `@`
   */
  trigger?: string;
  /**
   * Optional callback to fetch a list of at mention suggestions base on the query.
   */
  onQueryUpdated?: (query: string) => Promise<AtMentionSuggestion[]>;
  /**
   * Optional callback to render an item of the atMention suggestions list.
   */
  suggestionItemRenderer?: (suggestion: AtMentionSuggestion) => JSX.Element;
  /**
   * Optional callback called when a atMention suggestion is selected.
   */
  onSuggestionSelected?: (suggestion: AtMentionSuggestion) => void;
  /**
   * Optional boolean to determine if currently in mobile view.
   *
   * @defaultValue `false`
   */
  isMobile?: boolean;
}

/* @conditional-compile-remove(at-mention) */
/**
 * Options to display suggestions in the at mention scenario.
 *
 * @beta
 */
export interface AtMentionDisplayOptions {
  /**
   * Optional callback to override render of an at mention suggestion in a message thread.
   */
  atMentionSuggestionRenderer?: (suggestion: AtMentionSuggestion) => JSX.Element;
}

// /** @beta */
// export interface AtMentionDisplayOptions {
//   onAtMentionSuggestionClicked?: (suggestion: AtMentionSuggestion, mentionedSuggestionTarget: Target) => void;
//   onAtMentionSuggestionHovered?: (suggestion: AtMentionSuggestion, mentionedSuggestionTarget: Target) => void;
// }

/* @conditional-compile-remove(at-mention) */
/**
 * At mention suggestion's state, as reflected in the UI.
 *
 * @beta
 */
export interface AtMentionSuggestion {
  /** User ID of a mentioned participant or 'everyone' for an @everyone suggestion */
  userId: string;
  /** Type of an at mention suggestion */
  suggestionType: string;
  /** Display name of a mentioned participant */
  displayName?: string;
}

/* @conditional-compile-remove(at-mention) */
/**
 * Component to render at mention suggestions.
 *
 * @internal
 */
export const _AtMentionFlyout = (props: _AtMentionFlyoutProps): JSX.Element => {
  return <></>;
};
