// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, IIconStyles, Stack } from '@fluentui/react';
import { NotificationIconStyles, NotificationTextStyles } from './styles/MeetingCompositeStyles';

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

  const renderNumber = (numberOfMessages): JSX.Element => {
    if (numberOfMessages < 1) {
      return <></>;
    } else {
      return <Stack styles={NotificationTextStyles}>{numberOfMessages < 9 ? <>{numberOfMessages}</> : <>+9</>}</Stack>;
    }
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={notificationIconContainerStyles}>
      <Icon styles={NotificationIconStyles} iconName="NotificationCircle" />
      {renderNumber(numberOfMessages)}
    </Stack>
  );
};

const notificationIconContainerStyles: IIconStyles = {
  root: {
    position: 'absolute',
    top: 0,
    right: '0.78rem'
  }
};
