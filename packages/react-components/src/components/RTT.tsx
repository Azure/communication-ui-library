// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import { IPersona, Persona, Stack, PersonaSize, Text, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import React from 'react';
/* @conditional-compile-remove(rtt) */
import { OnRenderAvatarCallback } from '../types';
/* @conditional-compile-remove(rtt) */
import {
  captionClassName,
  captionsContentContainerClassName,
  displayNameClassName,
  displayNameContainerClassName,
  iconClassName,
  isTypingClassName,
  rttContainerClassName
} from './styles/Captions.style';
/* @conditional-compile-remove(rtt) */
import { _CaptionsInfo } from './CaptionsBanner';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * strings for rtt
 */
export interface RTTStrings {
  isTypingText?: string;
}

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * Props for a single line of RTT.
 */
export interface RTTProps extends _CaptionsInfo {
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Boolean indicating whether the RTT is still in progress
   */
  isTyping?: boolean;
  /**
   * Strings for RTT
   */
  strings?: RTTStrings;
}

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * A component for displaying a single line of RTT
 */
export const RTT = (props: RTTProps): JSX.Element => {
  const { displayName, userId, captionText, onRenderAvatar, isTyping } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.rtt;
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
          {captionText}
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
