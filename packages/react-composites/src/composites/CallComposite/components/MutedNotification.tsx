// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AnimationStyles, IStyle, ITheme, mergeStyles, Stack, Text, useTheme } from '@fluentui/react';
import React from 'react';
import { CallCompositeIcon } from '../../common/icons';
import { useLocale } from '../../localization';

/**
 * @private
 */
export interface MutedNotificationProps {
  speakingWhileMuted: boolean;
}

/**
 * Notify the user that they're muted.
 */
export function MutedNotification(props: MutedNotificationProps): JSX.Element {
  const locale = useLocale();
  const theme = useTheme();

  return (
    <Stack
      horizontal
      horizontalAlign="center"
      className={mergeStyles(
        props.speakingWhileMuted === true ? isSpeakingAndMutedAnimationStyles : isNotSpeakingAndMutedAnimationStyles
      )}
    >
      <Stack horizontal className={mergeStyles(stackStyle(theme))}>
        <CallCompositeIcon iconName="Muted" className={mergeStyles(iconStyle(theme))} />
        <Text className={mergeStyles(textStyle(theme))} aria-live={'polite'}>
          {locale.strings.call.mutedMessage}
        </Text>
      </Stack>
    </Stack>
  );
}

const stackStyle = (theme: ITheme): IStyle => {
  return {
    background: theme.palette.black,
    gap: `1rem`,
    padding: `1rem`,
    borderRadius: theme.effects.roundedCorner4,
    width: 'fit-content',
    opacity: 0.8
  };
};

const iconStyle = (theme: ITheme): IStyle => {
  return {
    color: theme.palette.white,
    maxHeight: '1.25rem'
  };
};

const textStyle = (theme: ITheme): IStyle => {
  return {
    color: theme.palette.white,
    fontSize: `1rem`
  };
};

const isSpeakingAndMutedAnimationStyles: IStyle = {
  ...AnimationStyles.fadeIn100
};

const isNotSpeakingAndMutedAnimationStyles: IStyle = {
  ...AnimationStyles.fadeOut200,
  display: 'none'
};
