// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IStyle, ITheme, mergeStyles, Stack, Text, useTheme } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';

/**
 * @alpha
 * xkcd - should be internal
 */
export interface MutedNotificationProps {}

/**
 * Notify the user that they're muted.
 *
 * @alpha
 * xkcd - should be internal
 */
export function MutedNotification(props: MutedNotificationProps): JSX.Element {
  const locale = useLocale();
  const theme = useTheme();

  return (
    <Stack horizontal className={mergeStyles(stackStyle(theme))}>
      <Icon iconName="Muted" className={mergeStyles(iconStyle(theme))} />
      <Text className={mergeStyles(textStyle(theme))}>{locale.strings.call.mutedMessage}</Text>
    </Stack>
  );
}

const stackStyle = (theme: ITheme): IStyle => {
  return {
    background: theme.palette.black,
    color: 'red',
    gap: `1rem`,
    padding: `1rem`,
    borderRadius: theme.effects.roundedCorner4
  };
};

const iconStyle = (theme: ITheme): IStyle => {
  return {
    color: theme.palette.white
  };
};

const textStyle = (theme: ITheme): IStyle => {
  return {
    color: theme.palette.white,
    fontSize: `1rem`
  };
};
