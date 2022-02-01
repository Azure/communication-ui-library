// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, IIconStyles, IStackStyles, ITheme, memoizeFunction, Stack, useTheme } from '@fluentui/react';

/**
 * @private
 */
export type NotificationIconProps = {
  numberOfMessages: number;
};
/**
 * @private
 */
export const NotificationIcon = (props: NotificationIconProps): JSX.Element => {
  const { numberOfMessages } = props;
  const theme = useTheme();
  const renderNumber = (numberOfMessages): JSX.Element => {
    if (numberOfMessages < 1) {
      return <></>;
    } else {
      return (
        <Stack styles={NotificationTextStyles(theme)}>{numberOfMessages < 9 ? <>{numberOfMessages}</> : <>+9</>}</Stack>
      );
    }
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={notificationIconContainerStyles}>
      <Icon styles={NotificationIconStyles(theme)} iconName="NotificationIcon" />
      {renderNumber(numberOfMessages)}
    </Stack>
  );
};

const notificationIconContainerStyles = memoizeFunction(
  (): IIconStyles => ({
    root: {
      position: 'absolute',
      top: '-0.5rem',
      right: '-0.5rem'
    }
  })
);

const NotificationIconStyles = memoizeFunction(
  (theme: ITheme): IIconStyles => ({
    root: {
      color: theme.palette.themePrimary
    }
  })
);

const NotificationTextStyles = memoizeFunction(
  (theme: ITheme): IStackStyles => ({
    root: {
      position: 'absolute',
      top: '0.1rem',
      color: theme.palette.white,
      fontSize: '0.8rem'
    }
  })
);
