// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, Stack } from '@fluentui/react';
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
  return (
    <Stack horizontalAlign="center" verticalAlign="center" style={{ position: 'absolute', top: 0, right: '0.78rem' }}>
      <Icon styles={NotificationIconStyles} iconName="NotificationCircle" />
      <Stack styles={NotificationTextStyles}>
        {numberOfMessages > 0 && numberOfMessages < 9 ? <>{numberOfMessages}</> : <></>}
        {numberOfMessages > 9 ? <>+9</> : <></>}
      </Stack>
    </Stack>
  );
};
