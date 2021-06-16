// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { typingIndicatorContainerStyle, typingIndicatorStringStyle } from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStylesProps, CommunicationParticipant } from '../types';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import { ILocaleKeys, useLocale } from '../localization/LocalizationProvider';
import { IObjectMap } from '../localization/localizationUtils';

export interface TypingIndicatorStylesProps extends BaseCustomStylesProps {
  /** Styles for each typing user's displayName. */
  typingUserDisplayName?: IStyle;
  /** Styles for the typing string. */
  typingString?: IStyle;
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
}

const MAXIMUM_LENGTH_OF_TYPING_USERS = 35;

const getIndicatorComponents = (
  typingUsers: CommunicationParticipant[],
  strings: ILocaleKeys,
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
    typingString = strings.typing_indicator_singular;
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned === 0) {
    typingString = strings.typing_indicator_plural;
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned === 1) {
    typingString = strings.typing_indicator_shortened_plural;
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned > 1) {
    typingString = strings.typing_indicator_shortened_plural_2;
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

const formatElements = (str: string, vars: IObjectMap<JSX.Element>): JSX.Element[] => {
  if (!str) {
    return [];
  }
  if (!vars) {
    return [];
  }

  const elements: JSX.Element[] = [];
  const placeholdersRegex = /{(\w+)}/g;
  const regex = RegExp(placeholdersRegex);
  let array: RegExpExecArray | null = regex.exec(str);
  let prev = 0;
  let elementKey = 1;
  while (array !== null) {
    if (prev !== array.index) {
      elements.push(<span key={elementKey++}>{str.substring(prev, array.index)}</span>);
    }
    elements.push(<span key={elementKey++}>{vars[array[0].substring(1, array[0].length - 1)]}</span>);
    prev = regex.lastIndex;
    array = regex.exec(str);
  }
  elements.push(<span key={elementKey++}>{str.substring(prev)}</span>);
  return elements;
};

/**
 * Typing Indicator is used to notify users if there are any other users typing in the thread.
 */
export const TypingIndicator = (props: TypingIndicatorProps): JSX.Element => {
  const { typingUsers, onRenderUsers, styles } = props;
  const { strings } = useLocale();

  const typingUsersToRender = onRenderUsers
    ? typingUsers
    : typingUsers.filter((typingUser) => typingUser.displayName !== undefined);

  return (
    <Stack className={mergeStyles(typingIndicatorContainerStyle, styles?.root)}>
      {getIndicatorComponents(typingUsersToRender, strings, onRenderUsers, styles)}
    </Stack>
  );
};
