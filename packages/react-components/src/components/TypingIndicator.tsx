// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  typingIndicatorContainerStyle,
  typingIndicatorListStyle,
  typingIndicatorVerbStyle
} from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStylesProps, WebUiChatParticipant } from '../types';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';

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
  typingUsers: WebUiChatParticipant[];
  /** The string to render after listing all users' display name. For example ' are typing ...'. */
  typingString?: string;
  /** Callback to render typing users */
  onRenderUsers?: (users: WebUiChatParticipant[]) => JSX.Element;
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

const getDefaultComponents = (
  typingUsers: WebUiChatParticipant[],
  styles?: TypingIndicatorStylesProps
): JSX.Element[] => {
  const displayComponents: JSX.Element[] = [];

  const typingUsersMentioned: WebUiChatParticipant[] = [];
  let countOfUsersMentioned = 0;
  let totalCharacterCount = 0;

  for (const typingUser of typingUsers) {
    // The typing users above will be separated by ', '. We account for that additional length and with this length in
    // mind we generate the final string.
    const additionalCharCount =
      2 * (countOfUsersMentioned - 1) + (typingUser.displayName ? typingUser.displayName.length : 0);
    if (totalCharacterCount + additionalCharCount <= MAXIMUM_LENGTH_OF_TYPING_USERS || countOfUsersMentioned === 1) {
      typingUsersMentioned.push(typingUser);
      totalCharacterCount += additionalCharCount;
      countOfUsersMentioned += 1;
    } else {
      break;
    }
  }

  typingUsersMentioned.forEach((typingUser, index) => {
    displayComponents.push(
      <span
        className={mergeStyles(typingIndicatorListStyle, styles?.typingUserDisplayName)}
        key={'typing indicator display string ' + index.toString()}
      >
        {index < typingUsers.length - 1 ? typingUser.displayName + ', ' : typingUser.displayName}
      </span>
    );
  });

  const countOfUsersNotMentioned = typingUsers.length - typingUsersMentioned.length;
  if (countOfUsersNotMentioned > 0) {
    displayComponents.push(
      <span className={mergeStyles(typingIndicatorVerbStyle, styles?.typingString)}>
        {` and ${countOfUsersNotMentioned} other${countOfUsersNotMentioned === 1 ? '' : 's'}`}
      </span>
    );
  }

  return displayComponents;
};

const defaultTypingString = (typingUsers: WebUiChatParticipant[]): string => {
  return typingUsers.length > 0 ? (typingUsers.length > 1 ? ' are typing...' : ' is typing...') : '';
};

/**
 * Typing Indicator is used to notify users if there are any other users typing in the thread.
 */
export const TypingIndicator = (props: TypingIndicatorProps): JSX.Element => {
  const { typingUsers, typingString, onRenderUsers, styles } = props;

  const typingUsersToRender = onRenderUsers
    ? typingUsers
    : typingUsers.filter((typingUser) => typingUser.displayName !== undefined);

  return (
    <Stack horizontal className={mergeStyles(typingIndicatorContainerStyle, styles?.root)}>
      {onRenderUsers ? onRenderUsers(typingUsersToRender) : getDefaultComponents(typingUsersToRender, styles)}
      <span className={mergeStyles(typingIndicatorVerbStyle, styles?.typingString)}>
        {typingString ?? defaultTypingString(typingUsersToRender)}
      </span>
    </Stack>
  );
};
