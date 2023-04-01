// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { FocusZone, Persona, PersonaSize, Stack, useTheme } from '@fluentui/react';
import {
  atMentionFlyoutContainer,
  headerStyleThemed,
  suggestionListStyle,
  suggestionListContainerStyle,
  suggestionItemStackStyle
} from './styles/AtMentionFlyout.style';
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';

/* @conditional-compile-remove(at-mention) */
/**
 * Props for {@link _AtMentionFlyout}.
 *
 * @internal
 */
export interface _AtMentionFlyoutProps {
  /**
   * Optional string used as at mention flyout's title.
   * @defaultValue `Suggestions`
   */
  title?: string;
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
  const { title = 'Suggestions', query, target, atMentionLookupOptions } = props;
  const { onQueryUpdated, suggestionItemRenderer, onSuggestionSelected } = atMentionLookupOptions ?? {};
  const theme = useTheme();
  const ids = useIdentifiers();
  const localeStrings = useLocale().strings.participantItem;

  const [suggestions, setSuggestions] = useState<AtMentionSuggestion[]>([]);
  const [refRect, setRefRect] = useState<DOMRect | undefined>(undefined);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      if (query && onQueryUpdated) {
        const list = (await onQueryUpdated(query)) || [];
        setSuggestions(list);
      }
    }
    fetchData();
  }, [onQueryUpdated, query]);

  useEffect(() => {
    const rect = target?.current?.getBoundingClientRect();
    setRefRect(rect);
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

  const defaultSuggestionItemRenderer = (suggestion: AtMentionSuggestion): JSX.Element => {
    return (
      <div
        data-is-focusable={true}
        data-ui-id={ids.atMentionSuggestionItem}
        onClick={() => onSuggestionSelected && onSuggestionSelected(suggestion)}
      >
        <Stack horizontal className={suggestionItemStackStyle}>
          {personaRenderer(suggestion.displayName)}
        </Stack>
      </div>
    );
  };

  return (
    <Stack className={atMentionFlyoutContainer(theme, refRect)}>
      <Stack.Item styles={headerStyleThemed(theme)} aria-label={title}>
        {title} {/* TODO: Localization  */}
      </Stack.Item>
      <FocusZone className={suggestionListContainerStyle} shouldFocusOnMount={true}>
        <Stack data-ui-id={ids.atMentionSuggestionList} className={suggestionListStyle}>
          {suggestions.map((suggestion) =>
            suggestionItemRenderer ? suggestionItemRenderer(suggestion) : defaultSuggestionItemRenderer(suggestion)
          )}
        </Stack>
      </FocusZone>
    </Stack>
  );
};
