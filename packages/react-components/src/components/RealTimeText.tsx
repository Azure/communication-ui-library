// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IPersona, Persona, Stack, PersonaSize, Text, useTheme } from '@fluentui/react';
import React from 'react';
import { OnRenderAvatarCallback } from '../types';
import {
  captionClassName,
  captionsContentContainerClassName,
  displayNameClassName,
  displayNameContainerClassName,
  iconClassName,
  isTypingClassName,
  rttContainerClassName
} from './styles/Captions.style';
import { useLocale } from '../localization';

/**
 * @public
 * strings for rtt
 */
export interface RealTimeTextStrings {
  /**
   * String indicating that the user is typing
   */
  isTypingText?: string;
}

/**
 * @public
 * Props for a single line of RealTimeText.
 */
export interface RealTimeTextProps {
  /**
   * RealTimeText id
   */
  id: number;
  /**
   * Display name of the user
   */
  displayName: string;
  /**
   * RealTimeText content
   */
  message: string;
  /**
   * user id of the user
   */
  userId?: string;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Boolean indicating whether the RealTimeText is still in progress
   */
  isTyping?: boolean;
  /**
   * Boolean indicating whether the RealTimeText is from the local user
   */
  isMe?: boolean;
  /**
   * Strings for RealTimeText
   */
  strings?: RealTimeTextStrings;
}

/**
 * @public
 * A component for displaying a single line of RealTimeText
 */
export const RealTimeText = (props: RealTimeTextProps): JSX.Element => {
  const { displayName, userId, message, onRenderAvatar, isTyping } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.realTimeText;
  const strings = { ...localeStrings, ...props.strings };

  const personaOptions: IPersona = {
    hidePersonaDetails: true,
    size: PersonaSize.size32,
    text: displayName,
    showOverflowTooltip: false,
    imageShouldStartVisible: true,
    initialsTextColor: 'white',
    styles: {
      root: {
        margin: '0.25rem'
      }
    }
  };

  const userIcon = onRenderAvatar ? onRenderAvatar(userId ?? '', personaOptions) : <Persona {...personaOptions} />;

  return (
    <Stack
      horizontal
      verticalAlign="start"
      horizontalAlign="start"
      className={rttContainerClassName(theme, isTyping ?? false)}
    >
      <Stack.Item className={iconClassName}>{userIcon}</Stack.Item>

      <Stack verticalAlign="start" className={captionsContentContainerClassName}>
        <Stack className={displayNameContainerClassName} horizontal>
          <Text className={displayNameClassName}>{displayName}</Text>
          {isTyping && <Text className={isTypingClassName(theme)}>{strings?.isTypingText}</Text>}
        </Stack>
        <Stack.Item className={captionClassName} dir="auto">
          {message}
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
