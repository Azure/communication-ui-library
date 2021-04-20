// © Microsoft Corporation. All rights reserved.

import {
  typingIndicatorContainerStyle,
  typingIndicatorListStyle,
  typingIndicatorVerbStyle
} from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStylesProps, WebUiChatParticipant } from '../types';
import { IStyle, mergeStyles } from '@fluentui/react';

export interface TypingIndicatorStylesProps extends BaseCustomStylesProps {
  /** Styles for each typing user's image. */
  typingUserImage?: IStyle;
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
  /** Callback to render each typing user */
  renderUserDisplayName?: (user: WebUiChatParticipant) => JSX.Element;
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

/**
 * React component that handles displaying a typing indicator on the screen.
 *
 * Some samples:
 * 'Username1 is typing...'
 * 'Username1, Username2 are typing...'
 * 'Username1, Username2 and 5 others are typing...'
 * '100 participants are typing...'
 *
 * @param props - An object of TypingIndicatorProps type that contains all data and functions needed.
 * @returns ReactElement
 */
export const TypingIndicator = (props: TypingIndicatorProps): JSX.Element => {
  const { typingUsers, typingString, renderUserDisplayName, styles } = props;

  const displayComponents: JSX.Element[] = [];

  const typingUsersMentioned: WebUiChatParticipant[] = [];
  let countOfUsersMentioned = 0;
  let totalCharacterCount = 0;

  for (const typingUser of typingUsers) {
    const displayName = typingUser?.displayName ?? 'unknown';
    countOfUsersMentioned += 1;
    // The typing users above will be separated by ', '. We account for that additional length and with this length in
    // mind we generate the final string.
    const additionalCharCount = 2 * (countOfUsersMentioned - 1) + displayName.length;
    if (totalCharacterCount + additionalCharCount <= MAXIMUM_LENGTH_OF_TYPING_USERS || countOfUsersMentioned === 1) {
      typingUsersMentioned.push(typingUser);
      totalCharacterCount += additionalCharCount;
    } else {
      break;
    }
  }

  typingUsersMentioned.forEach((typingUser, index) => {
    displayComponents.push(
      renderUserDisplayName ? (
        renderUserDisplayName(typingUser)
      ) : (
        <span
          className={mergeStyles(typingIndicatorListStyle, styles?.typingUserDisplayName)}
          key={'typing indicator display string ' + index.toString()}
        >
          {index < typingUsers.length - 1 ? typingUser.displayName + ', ' : typingUser.displayName}
        </span>
      )
    );
  });

  let textAfterUsers = '';
  const countOfUsersNotMentioned = typingUsers.length - typingUsersMentioned.length;
  if (countOfUsersNotMentioned > 0) {
    textAfterUsers = ` and ${countOfUsersNotMentioned} other${countOfUsersNotMentioned === 1 ? '' : 's'}`;
  }
  if (typingString !== undefined) {
    textAfterUsers += typingString;
  } else {
    textAfterUsers += typingUsers.length > 0 ? (typingUsers.length > 1 ? ' are typing...' : ' is typing...') : '';
  }

  return (
    <div className={mergeStyles(typingIndicatorContainerStyle, styles?.root)}>
      {displayComponents}
      <span className={mergeStyles(typingIndicatorVerbStyle, styles?.typingString)}>{textAfterUsers}</span>
    </div>
  );
};
