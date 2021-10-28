// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _formatSpanElements } from '@internal/acs-ui-common';

import { typingIndicatorContainerStyle, typingIndicatorStringStyle } from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStyles, CommunicationParticipant } from '../types';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import { useLocale } from '../localization/LocalizationProvider';
import { useIdentifiers } from '../identifiers';

/**
 * Fluent styles for {@link TypingIndicator}.
 *
 * @public
 */
export interface TypingIndicatorStylesProps extends BaseCustomStyles {
  /** Styles for each typing user's displayName. */
  typingUserDisplayName?: IStyle;
  /** Styles for the typing string. */
  typingString?: IStyle;
}

/**
 * Strings of {@link TypingIndicator} that can be overridden.
 *
 * @public
 */
export interface TypingIndicatorStrings {
  /**
   * String template to use when one user is typing. Placeholders: [user].
   * @example
   * ```
   * <TypingIndicator
   *  strings={{ multipleUsersAbbreviateOne: '{users} is typing...' }}
   *  typingUsers={[{ userId: 'user1', displayName: 'Claire' }]}
   * />
   * ```
   * would be 'Claire is typing...'
   **/
  singleUser: string;
  /**
   * String template to use when multiple users are typing. Placeholders: [users].
   * @example
   * ```
   * <TypingIndicator
   *  strings={{ multipleUsers: '{users} are typing...' }}
   *  typingUsers={[
   *    { userId: 'user1', displayName: 'Claire' },
   *    { userId: 'user2', displayName: 'Chris' }
   *  ]}
   * />
   * ```
   * would be 'Claire, Chris are typing...'
   **/
  multipleUsers: string;
  /**
   * String template to use when multiple users are typing with one other user abbreviated. Placeholders: [users].
   * @example
   * ```typescript
   * <TypingIndicator
   * strings={{ multipleUsersAbbreviateOne: '{users} and 1 other are typing...' }}
   * typingUsers={[
   * { userId: 'user1', displayName: 'Claire Romanov' },
   * { userId: 'user2', displayName: 'Chris Rutherford' }
   * ]}
   * />
   * ```
   * would be 'Claire Romanov and 1 other are typing...'
   **/
  multipleUsersAbbreviateOne: string;
  /**
   * String template to use when multiple users are typing with one other user abbreviated. Placeholders: [users, numOthers].
   * @example
   * ```
   * <TypingIndicator
   *  strings={{ multipleUsersAbbreviateMany: '{users} and {numOthers} others are typing...' }}
   *  typingUsers={[
   *    { userId: 'user1', displayName: 'Claire Romanov' },
   *    { userId: 'user2', displayName: 'Chris Rutherford' },
   *    { userId: 'user3', displayName: 'Jill Vernblom' }
   *  ]}
   * />
   * ```
   * would be 'Claire Romanov and 2 others are typing...'
   **/
  multipleUsersAbbreviateMany: string;
  /**
   * String to use as delimiter to separate multiple users.
   * @example
   * ```
   * <TypingIndicator
   *  strings={{ delimiter: ' + ' }}
   *  typingUsers={[
   *    { userId: 'user1', displayName: 'Claire' },
   *    { userId: 'user2', displayName: 'Chris' },
   *    { userId: 'user3', displayName: 'Jill' }
   *  ]}
   * />
   * ```
   * would be 'Claire + Chris + Jill are typing...'
   **/
  delimiter: string;
}

/**
 * Props for {@link TypingIndicator}.
 *
 * @public
 */
export interface TypingIndicatorProps {
  /** List of the typing users. */
  typingUsers: CommunicationParticipant[];
  /** Callback to render typing users */
  onRenderUser?: (users: CommunicationParticipant) => JSX.Element;
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

/**
 * Helper function to create element wrapping all typing users
 * @param typingUsers typing users
 * @param delimiter string to separate typing users
 * @param onRenderUser optional callback to render each typing user
 * @param styles optional additional IStyle to apply to element containing all users
 * @returns element wrapping all typing users
 */
const getUsersElement = (
  typingUsers: CommunicationParticipant[],
  delimiter: string,
  onRenderUser?: (users: CommunicationParticipant) => JSX.Element,
  styles?: IStyle
): JSX.Element => {
  const userElements: JSX.Element[] = [];
  typingUsers.forEach((user, index) => {
    userElements.push(onRenderUser ? onRenderUser(user) : <span key={`user-${index}`}>{user.displayName}</span>);
    userElements.push(<span key={`comma-${index}`}>{`${delimiter}`}</span>);
  });
  // pop last comma
  userElements.pop();
  return (
    <Stack horizontal className={mergeStyles(typingIndicatorStringStyle, styles)}>
      {userElements}
    </Stack>
  );
};

/**
 * Helper function to create span elements making up the typing indicator string
 * @param strings TypingIndicatorStrings containing strings to create span elements
 * @param usersElement JSX.Element containing all typing users
 * @param numTypingUsers number of total typing users
 * @param numUserNotMentioned number of typing users abbreviated
 * @returns array of span elements making up the typing indicator string
 */
const getSpanElements = (
  strings: TypingIndicatorStrings,
  usersElement: JSX.Element,
  numTypingUsers: number,
  numTypingUsersAbbreviated: number
): JSX.Element[] => {
  let variables: Record<string, JSX.Element> = {};
  let typingString = '';
  if (numTypingUsers === 1) {
    typingString = strings.singleUser;
    variables = {
      user: usersElement
    };
  } else if (numTypingUsers > 1 && numTypingUsersAbbreviated === 0) {
    typingString = strings.multipleUsers;
    variables = {
      users: usersElement
    };
  } else if (numTypingUsers > 1 && numTypingUsersAbbreviated === 1) {
    typingString = strings.multipleUsersAbbreviateOne;
    variables = {
      users: usersElement
    };
  } else if (numTypingUsers > 1 && numTypingUsersAbbreviated > 1) {
    typingString = strings.multipleUsersAbbreviateMany;
    variables = {
      users: usersElement,
      numOthers: <>{numTypingUsersAbbreviated}</>
    };
  }

  return _formatSpanElements(typingString, variables);
};

const IndicatorComponent = (
  typingUsers: CommunicationParticipant[],
  strings: TypingIndicatorStrings,
  onRenderUser?: (users: CommunicationParticipant) => JSX.Element,
  styles?: TypingIndicatorStylesProps
): JSX.Element => {
  const typingUsersMentioned: CommunicationParticipant[] = [];
  let totalCharacterCount = 0;
  const ids = useIdentifiers();

  for (const typingUser of typingUsers) {
    if (!typingUser.displayName) {
      continue;
    }

    let additionalCharCount = typingUser.displayName.length;
    // The typing users will be separated by the delimiter. We account for that additional length when we generate the final string.
    if (typingUsersMentioned.length > 0) {
      additionalCharCount += strings.delimiter.length;
    }

    if (
      totalCharacterCount + additionalCharCount <= MAXIMUM_LENGTH_OF_TYPING_USERS ||
      typingUsersMentioned.length === 0
    ) {
      typingUsersMentioned.push(typingUser);
      totalCharacterCount += additionalCharCount;
    } else {
      break;
    }
  }

  const usersElement: JSX.Element = getUsersElement(
    typingUsersMentioned,
    strings.delimiter,
    onRenderUser,
    styles?.typingUserDisplayName
  );

  const numUserNotMentioned = typingUsers.length - typingUsersMentioned.length;
  const spanElements: JSX.Element[] = getSpanElements(
    strings,
    usersElement,
    typingUsersMentioned.length,
    numUserNotMentioned
  );

  return (
    <Stack
      horizontal
      data-ui-id={ids.typingIndicator}
      className={mergeStyles(typingIndicatorStringStyle, styles?.typingString)}
      key="typingStringKey"
    >
      {spanElements}
    </Stack>
  );
};

/**
 * Component to notify local user when one or more participants in the chat thread are typing.
 *
 * @public
 */
export const TypingIndicator = (props: TypingIndicatorProps): JSX.Element => {
  const { typingUsers, onRenderUser, styles } = props;
  const { strings } = useLocale();

  const typingUsersToRender = typingUsers.filter((typingUser) => typingUser.displayName !== undefined);

  const indicatorComponent = IndicatorComponent(
    typingUsersToRender,
    { ...strings.typingIndicator, ...props.strings },
    onRenderUser,
    styles
  );

  return <Stack className={mergeStyles(typingIndicatorContainerStyle, styles?.root)}>{indicatorComponent}</Stack>;
};
