// © Microsoft Corporation. All rights reserved.

import {
  typingIndicatorContainerStyle,
  typingIndicatorListStyle,
  typingIndicatorVerbStyle,
  typingIndicatorPrefixImageStyle
} from './styles/TypingIndicator.styles';

import React from 'react';
import { BaseCustomStylesProps, TypingUser } from '../types';
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
  typingUsers: TypingUser[];
  /** The string to render after listing all users' display name. For example ' are typing ...'. */
  typingString: string;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <TypingIndicator styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: TypingIndicatorStylesProps;
}

/**
 * React component that handles displaying a typing indicator on the screen.
 *
 * Some samples:
 * 'Username1 is typing...'
 * 'Username1, Username2 are typing...'
 * 'Username1, Username2 and 5 others are typing...'
 * '100 participants are typing...'
 *
 * TypingIndicator can be customized. TODO: See the parameters in
 * MapToTypingUsers.convertSdkTypingUsersDataToTypingUsersData. We need to design a way for users to provide this.
 *
 * @param props - An object of TypingIndicatorProps type that contains all data and functions needed.
 * @returns ReactElement
 */
export const TypingIndicator = (props: TypingIndicatorProps): JSX.Element => {
  const displayComponents: JSX.Element[] = [];
  const { typingUsers, typingString, styles } = props;

  typingUsers.map((typingUser: TypingUser, index: number) => {
    if (typingUser.prefixImageUrl.length !== 0) {
      displayComponents.push(
        <img
          key={'typing indicator prefix ' + index.toString()}
          className={mergeStyles(typingIndicatorPrefixImageStyle, styles?.typingUserImage)}
          src={typingUser.prefixImageUrl}
          alt={'typing indicator prefix avatar/profile/icon'}
        />
      );
    }
    displayComponents.push(
      <span
        className={mergeStyles(typingIndicatorListStyle, styles?.typingUserDisplayName)}
        key={'typing indicator display string ' + index.toString()}
      >
        {index < typingUsers.length - 1 ? typingUser.displayName + ', ' : typingUser.displayName}
      </span>
    );
    return undefined;
  });

  return (
    <div className={mergeStyles(typingIndicatorContainerStyle, styles?.root)}>
      {displayComponents}
      <span className={mergeStyles(typingIndicatorVerbStyle, styles?.typingString)}>{typingString}</span>
    </div>
  );
};
