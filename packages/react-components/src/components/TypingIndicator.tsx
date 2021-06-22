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
  /**
   * String template to use when one user is typing. Placeholders: [user].
   * 
   * Example: 
   * ```typescript
   *  <TypingIndicator
        strings={{ multipleUsersAbbreviateOne: '{users} is typing...' }}
        typingUsers={[{ userId: 'user1', displayName: 'Claire' }]}
      />
    ```
   *  would be 'Claire is typing...'
   */
  singleUser: string;
  /**
   * String template to use when multiple users are typing. Placeholders: [users].
   * Example:
   * ```typescript
   *  <TypingIndicator
        strings={{ multipleUsers: '{users} are typing...' }}
        typingUsers={[
          { userId: 'user1', displayName: 'Claire' },
          { userId: 'user2', displayName: 'Chris' }
        ]}
      />
      ```
   *  would be 'Claire, Chris are typing...'
   */
  multipleUsers: string;
  /**
   * String template to use when multiple users are typing with one other user abbreviated. Placeholders: [users].
   * Example:
   * ```typescript
   * <TypingIndicator
        strings={{ multipleUsersAbbreviateOne: '{users} and 1 other are typing...' }}
        typingUsers={[
          { userId: 'user1', displayName: 'Claire Romanov' },
          { userId: 'user2', displayName: 'Chris Rutherford' }
        ]}
      />
      ```
   *  would be 'Claire Romanov and 1 other are typing...'
   */
  multipleUsersAbbreviateOne: string;
  /**
   * String template to use when multiple users are typing with one other user abbreviated. Placeholders: [users].
   * Example:
   * ```typescript
   * <TypingIndicator
        strings={{ multipleUsersAbbreviateMany: '{users} and {numOthers} others are typing...' }}
        typingUsers={[
          { userId: 'user1', displayName: 'Claire Romanov' },
          { userId: 'user2', displayName: 'Chris Rutherford' },
          { userId: 'user3', displayName: 'Jill Vernblom' }
        ]}
      />
      ```
   *  would be 'Claire Romanov and 2 others are typing...'
   */
  multipleUsersAbbreviateMany: string;
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
  strings?: Partial<TypingIndicatorStrings>;
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

  const usersElement = onRenderUsers ? (
    onRenderUsers(typingUsers)
  ) : (
    <Stack className={mergeStyles(typingIndicatorStringStyle, styles?.typingUserDisplayName)}>
      {typingUsersMentioned.join(', ')}
    </Stack>
  );
  let variables: Record<string, JSX.Element> = {};
  let typingString = '';
  if (typingUsers.length === 1) {
    typingString = strings.singleUser;
    variables = {
      user: usersElement
    };
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned === 0) {
    typingString = strings.multipleUsers;
    variables = {
      users: usersElement
    };
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned === 1) {
    typingString = strings.multipleUsersAbbreviateOne;
    variables = {
      users: usersElement
    };
  } else if (typingUsers.length > 1 && countOfUsersNotMentioned > 1) {
    typingString = strings.multipleUsersAbbreviateMany;
    variables = {
      users: usersElement,
      numOthers: <>{countOfUsersNotMentioned}</>
    };
  }

  return (
    <Stack horizontal className={mergeStyles(typingIndicatorStringStyle, styles?.typingString)} key="typingStringKey">
      {formatElements(typingString, variables)}
    </Stack>
  );
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
      {getIndicatorComponents(
        typingUsersToRender,
        { ...strings.typingIndicator, ...props.strings },
        onRenderUsers,
        styles
      )}
    </Stack>
  );
};
