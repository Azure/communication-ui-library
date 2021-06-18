// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { typingIndicatorContainerStyle, typingIndicatorStringStyle } from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStylesProps, CommunicationParticipant } from '../types';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import { useLocale } from '../localization/LocalizationProvider';
import { formatElements } from '../localization/localizationUtils';

export interface TypingIndicatorStylesProps extends BaseCustomStylesProps {
  /** Styles for each typing user's displayName. */
  typingUserDisplayName?: IStyle;
  /** Styles for the typing string. */
  typingString?: IStyle;
}

/**
 * Strings of TypingIndicator that can be overridden
 */
export interface TypingIndicatorStrings {
  /** String to use when one user is typing */
  singular: string;
  /** String to use when multiple users are typing */
  plural: string;
  /** String to use when multiple users are typing with one other user abbreviated */
  shortenedPlural: string;
  /** String to use when multiple users are typing with multiple other users abbreviated */
  shortenedPlural2: string;
}

/**
 * Props for TypingIndicator component
 */
export interface TypingIndicatorProps {
  /** List of the typing users. */
  typingUsers: CommunicationParticipant[];
  /** Callback to render typing users */
  onRenderUsers?: (users: CommunicationParticipant[]) => JSX.Element;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <TypingIndicator styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: TypingIndicatorStylesProps;

  /**
   * Optional strings to override in component
   */
  strings?: TypingIndicatorStrings;
}

const MAXIMUM_LENGTH_OF_TYPING_USERS = 35;

const getIndicatorComponents = (
  typingUsers: CommunicationParticipant[],
  strings: TypingIndicatorStrings,
  onRenderUsers?: (users: CommunicationParticipant[]) => JSX.Element,
  styles?: TypingIndicatorStylesProps
): JSX.Element => {
  const typingUsersMentioned: string[] = [];
  let countOfUsersMentioned = 0;
  let totalCharacterCount = 0;

  for (const typingUser of typingUsers) {
    // The typing users above will be separated by ', '. We account for that additional length and with this length in
    // mind we generate the final string.
    const additionalCharCount =
      2 * (countOfUsersMentioned - 1) + (typingUser.displayName ? typingUser.displayName.length : 0);
    if (totalCharacterCount + additionalCharCount <= MAXIMUM_LENGTH_OF_TYPING_USERS || countOfUsersMentioned === 1) {
      if (typingUser.displayName) {
        typingUsersMentioned.push(typingUser.displayName);
      }
      totalCharacterCount += additionalCharCount;
      countOfUsersMentioned += 1;
    } else {
      break;
    }
  }

  const countOfUsersNotMentioned = typingUsers.length - typingUsersMentioned.length;

  let typingString = '';
  if (typingUsers.length === 1) {
    typingString = strings.singular;
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned === 0) {
    typingString = strings.plural;
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned === 1) {
    typingString = strings.shortenedPlural;
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned > 1) {
    typingString = strings.shortenedPlural2;
  }

  return (
    <Stack horizontal className={mergeStyles(typingIndicatorStringStyle, styles?.typingString)} key="typingStringKey">
      {formatElements(typingString, {
        users: onRenderUsers ? (
          onRenderUsers(typingUsers)
        ) : (
          <Stack className={mergeStyles(typingIndicatorStringStyle, styles?.typingUserDisplayName)}>
            {typingUsersMentioned.join(', ')}
          </Stack>
        ),
        numOthers: <>`${countOfUsersNotMentioned}`</>
      })}
    </Stack>
  );
};

/**
 * Typing Indicator is used to notify users if there are any other users typing in the thread.
 */
export const TypingIndicator = (props: TypingIndicatorProps): JSX.Element => {
  const { typingUsers, onRenderUsers, styles, strings } = props;
  const { typingIndicatorStrings } = useLocale();

  const typingUsersToRender = onRenderUsers
    ? typingUsers
    : typingUsers.filter((typingUser) => typingUser.displayName !== undefined);

  return (
    <Stack className={mergeStyles(typingIndicatorContainerStyle, styles?.root)}>
      {getIndicatorComponents(typingUsersToRender, strings ?? typingIndicatorStrings, onRenderUsers, styles)}
    </Stack>
  );
};
