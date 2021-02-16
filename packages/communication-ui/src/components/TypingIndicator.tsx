// © Microsoft Corporation. All rights reserved.

import {
  TypingIndicatorContainerStyle,
  TypingIndicatorListStyle,
  TypingIndicatorVerbStyle,
  TypingIndicatorPrefixImageStyle
} from './styles/TypingIndicator.styles';

import React from 'react';
import { connectFuncsToContext } from '../consumers/ConnectContext';
import { MapToTypingIndicatorProps, TypingIndicatorProps } from '../consumers/MapToTypingIndicatorProps';
import { TypingUser } from '../types/TypingUser';

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
 * @param props - An object of TypingIndicatorProps type that contains all data and functions needed
 * @returns ReactElement
 */
export const TypingIndicatorComponent = (props: TypingIndicatorProps): JSX.Element => {
  const displayComponents: JSX.Element[] = [];
  props.typingUsers.map((typingUser: TypingUser, index: number) => {
    if (typingUser.prefixImageUrl.length !== 0) {
      displayComponents.push(
        <img
          key={'typing indicator prefix ' + index.toString()}
          className={TypingIndicatorPrefixImageStyle}
          src={typingUser.prefixImageUrl}
          alt={'typing indicator prefix avatar/profile/icon'}
        />
      );
    }
    displayComponents.push(
      <span className={TypingIndicatorListStyle} key={'typing indicator display string ' + index.toString()}>
        {index < props.typingUsers.length - 1 ? typingUser.displayName + ', ' : typingUser.displayName}
      </span>
    );
    return undefined;
  });

  return (
    <div className={TypingIndicatorContainerStyle}>
      {displayComponents}
      <span className={TypingIndicatorVerbStyle}>{props.typingString}</span>
    </div>
  );
};

export default connectFuncsToContext(TypingIndicatorComponent, MapToTypingIndicatorProps);
