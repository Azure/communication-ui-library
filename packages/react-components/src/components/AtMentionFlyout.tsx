// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { FocusZone, Persona, PersonaSize, Stack, mergeStyles, useTheme } from '@fluentui/react';
import {
  mentionFlyoutContainerStyle,
  headerStyleThemed,
  suggestionListStyle,
  suggestionListContainerStyle,
  suggestionItemStackStyle,
  suggestionItemWrapperStyle
} from './styles/AtMentionFlyout.style';
/* @conditional-compile-remove(at-mention) */
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';

/**
 * Props for {@link _AtMentionFlyout}.
 *
 * @internal
 */
export interface _AtMentionFlyoutProps {
  /**
   * Array of at mention suggestions used to populate the suggestion list
   */
  suggestions: AtMentionSuggestion[];
  /**
   * Optional string used as at mention flyout's title.
   * @defaultValue `Suggestions`
   */
  title?: string;
  /**
   * Element to anchor the flyout to.
   */
  target: React.RefObject<Element>;
  /**
   * When rendering the flyout, where to position it relative to the target.
   */
  targetPositionOffset?: { top: number; left: number };
  /**
   * Where to display the suggestions relative to the target.
   * @defaultValue `above`
   */
  location?: 'above' | 'below';
  /**
   * Callback called when a mention suggestion is selected.
   */
  onSuggestionSelected: (suggestion: AtMentionSuggestion) => void;
  /**
   * Callback to invoke when the flyout is dismissed
   */
  onDismiss?: () => void;
  /**
   * Optional callback to render an item of the atMention suggestions list.
   */
  onRenderSuggestionItem?: (
    suggestion: AtMentionSuggestion,
    onSuggestionSelected?: (suggestion: AtMentionSuggestion) => void
  ) => JSX.Element;
}

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
  onQueryUpdated: (query: string) => Promise<AtMentionSuggestion[]>;
  /**
   * Optional callback to render an item of the atMention suggestions list.
   */
  onRenderSuggestionItem?: (
    suggestion: AtMentionSuggestion,
    onSuggestionSelected: (suggestion: AtMentionSuggestion) => void
  ) => JSX.Element;
}

/**
 * Options to display suggestions in the at mention scenario.
 *
 * @beta
 */
export interface AtMentionDisplayOptions {
  /**
   * Optional callback to override render of a mention in a message thread.
   */
  onRenderAtMentionSuggestion?: (suggestion: AtMentionSuggestion) => JSX.Element;
}

/**
 * Options to lookup suggestions and display mentions in the at mention scenario.
 *
 * @beta
 */
export type AtMentionOptions = AtMentionLookupOptions | AtMentionDisplayOptions;

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
  displayName: string;
}

/**
 * Component to render a pop-up of mention suggestions.
 *
 * @internal
 */
export const _AtMentionFlyout = (props: _AtMentionFlyoutProps): JSX.Element => {
  interface Position {
    x: number;
    top?: number;
    bottom?: number;
  }

  const {
    suggestions,
    title = 'Suggestions' /* TODO: Localization of the default */,
    target,
    targetPositionOffset,
    onRenderSuggestionItem,
    onSuggestionSelected,
    location
  } = props;

  const theme = useTheme();
  const ids = useIdentifiers();
  const [position, setPosition] = useState<Position>({ x: 0 });
  const [hoveredSuggestion, setHoveredSuggestion] = useState<AtMentionSuggestion | undefined>(undefined);

  // Determine popover position
  useEffect(() => {
    const rect = target?.current?.getBoundingClientRect();
    // Show above by default
    let finalPosition: Position = {
      x: targetPositionOffset?.left ?? 0
    };
    if (location === 'below') {
      finalPosition.top = (rect?.height ?? 0) + (targetPositionOffset?.top ?? 0);
    } else {
      // (location === 'above')
      finalPosition.bottom = (rect?.height ?? 0) + (targetPositionOffset?.top ?? 0);
    }
    setPosition(finalPosition);
  }, [location, target, targetPositionOffset]);

  const personaRenderer = (displayName?: string): JSX.Element => {
    const localeStrings = useLocale().strings.participantItem;

    const avatarOptions = {
      text: displayName?.trim() || localeStrings.displayNamePlaceholder,
      size: PersonaSize.size24,
      initialsColor: theme.palette.neutralLight,
      initialsTextColor: theme.palette.neutralSecondary,
      showOverflowTooltip: false,
      showUnknownPersonaCoin: !displayName?.trim() || displayName === localeStrings.displayNamePlaceholder
    };

    return <Persona {...avatarOptions} />;
  };

  const defaultOnRenderSuggestionItem = (
    suggestion: AtMentionSuggestion,
    onSuggestionSelected: (suggestion: AtMentionSuggestion) => void
  ): JSX.Element => {
    const isSuggestionHovered = hoveredSuggestion?.userId === suggestion.userId;

    return (
      <div
        data-is-focusable={true}
        data-ui-id={ids.atMentionSuggestionItem}
        key={suggestion.userId}
        onClick={() => onSuggestionSelected(suggestion)}
        onMouseEnter={() => setHoveredSuggestion(suggestion)}
        onMouseLeave={() => setHoveredSuggestion(undefined)}
        className={suggestionItemWrapperStyle(theme)}
      >
        <Stack horizontal className={suggestionItemStackStyle(theme, isSuggestionHovered)}>
          {personaRenderer(suggestion.displayName)}
        </Stack>
      </div>
    );
  };

  return (
    <Stack
      className={mergeStyles(mentionFlyoutContainerStyle(theme), {
        left: position.x,
        top: position.top,
        bottom: position.bottom,
        maxHeight: 212,
        position: 'absolute'
      })}
    >
      <Stack.Item styles={headerStyleThemed(theme)} aria-label={title}>
        {title}
      </Stack.Item>
      <FocusZone className={suggestionListContainerStyle}>
        <Stack
          /* @conditional-compile-remove(at-mention) */
          data-ui-id={ids.atMentionSuggestionList}
          className={suggestionListStyle}
        >
          {suggestions.map((suggestion) =>
            onRenderSuggestionItem
              ? onRenderSuggestionItem(suggestion, onSuggestionSelected)
              : defaultOnRenderSuggestionItem(suggestion, onSuggestionSelected)
          )}
        </Stack>
      </FocusZone>
    </Stack>
  );
};
