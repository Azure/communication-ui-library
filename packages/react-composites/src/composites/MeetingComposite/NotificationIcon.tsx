// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, IIconStyles, IStackStyles, ITheme, memoizeFunction, Stack, useTheme, Text } from '@fluentui/react';

/**
 * @private
 */
export type NotificationIconProps = {
  chatMessagesCount: number;
  label?: string;
};
/**
 * @private
 */
export const NotificationIcon = (props: NotificationIconProps): JSX.Element => {
  const { chatMessagesCount, label } = props;
  const theme = useTheme();
  const renderNumber = (numberOfMessages): JSX.Element => {
    if (numberOfMessages < 1) {
      return <></>;
    } else {
      return (
        <Text aria-label={label} role={'status'} styles={notificationTextStyles(theme)}>
          {numberOfMessages < 9 ? numberOfMessages : '9+'}
        </Text>
      );
    }
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={notificationIconContainerStyles}>
      <Icon styles={notificationIconStyles(theme)} iconName="ControlBarButtonBadgeIcon" />
      {renderNumber(chatMessagesCount)}
    </Stack>
  );
};

const notificationIconContainerStyles = memoizeFunction(
  (): IIconStyles => ({
    root: {
      // positioning to place the badge within the button appropriately.
      position: 'absolute',
      top: '-0.5rem',
      right: '-0.5rem'
    }
  })
);

const notificationIconStyles = memoizeFunction(
  (theme: ITheme): IIconStyles => ({
    root: {
      color: theme.palette.themePrimary
    }
  })
);

const notificationTextStyles = memoizeFunction(
  (theme: ITheme): IStackStyles => ({
    root: {
      position: 'absolute',
      top: '0.1rem',
      color: theme.palette.white,
      fontSize: theme.fonts.smallPlus.fontSize
    }
  })
);
