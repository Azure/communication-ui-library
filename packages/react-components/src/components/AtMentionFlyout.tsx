// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { FocusZone, Persona, PersonaSize, Stack, useTheme } from '@fluentui/react';
import {
  atMentionFlyoutContainer,
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
   * Optional RefObject used as a reference to position AtMentionFlyout.
   */
  target?: React.RefObject<Element>;
  /**
   * Optional callback called when a atMention suggestion is selected.
   */
  onSuggestionSelected?: (suggestion: AtMentionSuggestion) => void;
  /**
   * Callback to invoke when the at mention flyout is dismissed
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
    onSuggestionSelected?: (suggestion: AtMentionSuggestion) => void
  ) => JSX.Element;
}

/**
 * Options to display suggestions in the at mention scenario.
 *
 * @beta
 */
export interface AtMentionDisplayOptions {
  /**
   * Optional callback to override render of an mention in a message thread.
   */
  onRenderAtMentionSuggestion?: (suggestion: AtMentionSuggestion) => JSX.Element;
}

/**
 * Options to lookup suggestions and display mentions in the at mention scenario.
 *
 * @beta
 */
export type AtMentionOptions = AtMentionLookupOptions & AtMentionDisplayOptions;

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
 * Component to render at mention suggestions.
 *
 * @internal
 */
export const _AtMentionFlyout = (props: _AtMentionFlyoutProps): JSX.Element => {
  // Temporary implementation for AtMentionFlyout's position.
  interface Position {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
  const { suggestions, title = 'Suggestions', target, onRenderSuggestionItem, onSuggestionSelected } = props;
  const theme = useTheme();
  /* @conditional-compile-remove(at-mention) */
  const ids = useIdentifiers();
  const localeStrings = useLocale().strings.participantItem;

  const [position, setPosition] = useState<Position>({ top: 0, right: 0, bottom: 0, left: 0 });
  const [hoveredSuggestion, setHoveredSuggestion] = useState<AtMentionSuggestion | undefined>(undefined);

  // Temporary implementation for AtMentionFlyout's position.
  useEffect(() => {
    const rect = target?.current?.getBoundingClientRect();
    const { top = 0, left = 0, right = 0, bottom = 0, height = 0 } = rect ?? {};
    const flyoutHeight = 212;
    const flyoutTop = top - flyoutHeight - height - 24;
    setPosition({ top: flyoutTop > 0 ? flyoutTop : 0, left, right, bottom });
  }, [target]);

  const personaRenderer = (displayName?: string): JSX.Element => {
    const avatarOptions = {
      text: displayName?.trim() || localeStrings.displayNamePlaceholder,
      size: PersonaSize.size28,
      initialsColor: theme.palette.neutralLight,
      initialsTextColor: theme.palette.neutralSecondary,
      showOverflowTooltip: false,
      showUnknownPersonaCoin: !displayName?.trim() || displayName === localeStrings.displayNamePlaceholder
    };

    return <Persona {...avatarOptions} />;
  };

  const defaultOnRenderSuggestionItem = (suggestion: AtMentionSuggestion): JSX.Element => {
    const isSuggestionHovered = hoveredSuggestion?.userId === suggestion.userId;
    return (
      <div
        data-is-focusable={true}
        /* @conditional-compile-remove(at-mention) */
        data-ui-id={ids.atMentionSuggestionItem}
        key={suggestion.userId}
        onClick={() => onSuggestionSelected && onSuggestionSelected(suggestion)}
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
    <Stack className={atMentionFlyoutContainer(theme, position.left, position.top)}>
      <Stack.Item styles={headerStyleThemed(theme)} aria-label={title}>
        {title} {/* TODO: Localization  */}
      </Stack.Item>
      <FocusZone className={suggestionListContainerStyle} shouldFocusOnMount={true}>
        <Stack
          /* @conditional-compile-remove(at-mention) */
          data-ui-id={ids.atMentionSuggestionList}
          className={suggestionListStyle}
        >
          {suggestions.map((suggestion) =>
            onRenderSuggestionItem
              ? onRenderSuggestionItem(suggestion, onSuggestionSelected)
              : defaultOnRenderSuggestionItem(suggestion)
          )}
        </Stack>
      </FocusZone>
    </Stack>
  );
};
