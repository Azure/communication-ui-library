// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, Stack } from '@fluentui/react';
import { NotificationIconStyles, NotificationTextStyles } from './styles/MeetingCompositeStyles';

/**
 * @private
 */
export type NotificationIconProps = {
  chatMessagesCount: number;
};
/**
 * @private
 */
export const NotificationIcon = (props: NotificationIconProps): JSX.Element => {
  const { chatMessagesCount } = props;
  return (
    <Stack horizontalAlign="center" verticalAlign="center" style={{ position: 'absolute', top: 0, right: '0.78rem' }}>
      <Icon styles={NotificationIconStyles} iconName="NotificationIcon" />
      <Stack styles={NotificationTextStyles}>
        {chatMessagesCount > 0 && chatMessagesCount < 9 ? <>{chatMessagesCount}</> : <></>}
        {chatMessagesCount >= 9 ? <>9+</> : <></>}
      </Stack>
    </Stack>
  );
};
