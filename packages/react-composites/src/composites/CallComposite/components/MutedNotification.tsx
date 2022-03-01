// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, ITheme, mergeStyles, Stack, Text, useTheme } from '@fluentui/react';
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

  if (!props.speakingWhileMuted) {
    return <></>;
  }

  return (
    <Stack horizontal horizontalAlign="center">
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
    opacity: 0.8,
    gap: `1rem`,
    padding: `1rem`,
    borderRadius: theme.effects.roundedCorner4,
    width: 'fit-content'
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
