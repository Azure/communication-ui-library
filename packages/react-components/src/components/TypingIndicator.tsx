// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { typingIndicatorContainerStyle, typingIndicatorStringStyle } from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStyles, CommunicationParticipant } from '../types';
import { IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import { useLocale } from '../localization/LocalizationProvider';
import { useIdentifiers } from '../identifiers';
import { _IObjectMap } from '@internal/acs-ui-common';

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
   *    { userId: 'user2', displayName: 'Christopher' }
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
   * { userId: 'user2', displayName: 'Christopher Rutherford' }
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
   *    { userId: 'user2', displayName: 'Christopher Rutherford' },
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
 * @param userDisplayNameStyles optional additional IStyle to apply to each element containing users name
 * @returns element wrapping all typing users
 */
const getUsersElement = (
  typingUsers: CommunicationParticipant[],
  delimiter: string,
  onRenderUser?: (users: CommunicationParticipant) => JSX.Element,
  userDisplayNameStyles?: IStyle
): JSX.Element => {
  const userElements: JSX.Element[] = [];
  typingUsers.forEach((user, index) => {
    let truncatedDisplayName = user.displayName;
    if (truncatedDisplayName && truncatedDisplayName.length > 50) {
      truncatedDisplayName = truncatedDisplayName.substring(0, 50) + '...';
    }
    userElements.push(
      onRenderUser ? (
        onRenderUser(user)
      ) : (
        <Text className={mergeStyles(userDisplayNameStyles)} key={`user-${index}`}>
          {truncatedDisplayName}
        </Text>
      )
    );
    userElements.push(<Text key={`comma-${index}`}>{`${delimiter}`}</Text>);
  });
  // pop last comma
  userElements.pop();
  return <>{userElements}</>;
};

/**
 * Helper function to get a string of all typing users
 * @param typingUsers typing users
 * @param delimiter string to separate typing users
 * @returns string of all typing users
 */
const getNamesString = (typingUsers: CommunicationParticipant[], delimiter: string): string => {
  const userNames: string[] = [];

  typingUsers.forEach((user) => {
    if (user.displayName) {
      userNames.push(user.displayName);
    }
  });
  return userNames.join(delimiter);
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

  return formatInlineElements(typingString, variables);
};

/**
 * Helper function to get the string making up the typing indicator string
 * @param strings TypingIndicatorStrings containing strings to create span elements
 * @param namesString string of all typing users
 * @param numTypingUsers number of total typing users
 * @param numUserNotMentioned number of typing users abbreviated
 * @returns typing indicator string
 */
const getIndicatorString = (
  strings: TypingIndicatorStrings,
  namesString: string,
  numTypingUsers: number,
  numTypingUsersAbbreviated: number
): string | undefined => {
  if (numTypingUsers === 1) {
    return strings.singleUser.replace('{user}', namesString);
  }

  if (numTypingUsers > 1 && numTypingUsersAbbreviated === 0) {
    return strings.multipleUsers.replace('{users}', namesString);
  }

  if (numTypingUsers > 1 && numTypingUsersAbbreviated === 1) {
    return strings.multipleUsersAbbreviateOne.replace('{users}', namesString);
  }

  if (numTypingUsers > 1 && numTypingUsersAbbreviated > 1) {
    return strings.multipleUsersAbbreviateMany
      .replace('{users}', namesString)
      .replace('{numOthers}', `${numTypingUsersAbbreviated}`);
  }

  return undefined;
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
  const spanElements: JSX.Element[] = getSpanElements(strings, usersElement, typingUsers.length, numUserNotMentioned);

  const labelString = getIndicatorString(
    strings,
    getNamesString(typingUsersMentioned, strings.delimiter),
    typingUsers.length,
    numUserNotMentioned
  );

  return (
    <div
      data-ui-id={ids.typingIndicator}
      className={mergeStyles(typingIndicatorStringStyle, styles?.typingString)}
      key="typingStringKey"
      role="status"
      aria-label={labelString}
    >
      {spanElements}
    </div>
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

/**
 * Create an array of span elements by replacing the pattern "\{\}" in str with the elements
 * passed in as vars and creating inline elements from the rest
 *
 * @param str - The string to be formatted
 * @param vars - Variables to use to format the string
 * @returns formatted JSX elements
 */
const formatInlineElements = (str: string, vars: _IObjectMap<JSX.Element>): JSX.Element[] => {
  if (!str) {
    return [];
  }
  if (!vars) {
    return [];
  }

  const elements: JSX.Element[] = [];

  // regex to search for the pattern "{}"
  const placeholdersRegex = /{(\w+)}/g;
  const regex = RegExp(placeholdersRegex);
  let array: RegExpExecArray | null = regex.exec(str);
  let prev = 0;
  while (array !== null) {
    if (prev !== array.index) {
      elements.push(<Text key={elements.length}>{str.substring(prev, array.index)}</Text>);
    }
    elements.push(<Text key={elements.length}>{vars[array[0].substring(1, array[0].length - 1)]}</Text>);
    prev = regex.lastIndex;
    array = regex.exec(str);
  }
  elements.push(<Text key={elements.length}>{str.substring(prev)}</Text>);
  return elements;
};
