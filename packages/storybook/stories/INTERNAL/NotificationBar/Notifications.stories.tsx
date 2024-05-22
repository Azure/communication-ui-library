// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  ActiveNotification,
  Notifications as NotificationsComponent
} from '../../../../react-components/src/components';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const NotificationsStory = (): JSX.Element => {
  const containerStyles = {
    width: '100%',
    height: '100%',
    padding: '2rem'
  };

  const activeNotifications: ActiveNotification[] = [
    {
      type: 'unableToReachChatService',
      iconName: 'ErrorBarCallNetworkQualityLow'
    },
    {
      type: 'accessDenied',
      iconName: 'ErrorBarCallNetworkQualityLow'
    },
    {
      type: 'sendMessageGeneric',
      iconName: 'ErrorBarCallNetworkQualityLow'
    },
    {
      type: 'sendMessageNotInChatThread',
      iconName: 'ErrorBarCallNetworkQualityLow'
    },
    {
      type: 'userNotInChatThread',
      iconName: 'ErrorBarCallNetworkQualityLow'
    }
  ];

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
      <NotificationsComponent activeNotifications={activeNotifications} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Notifications = NotificationsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-Notifications`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Notifications/Notifications`,
  component: Notifications,
  argTypes: {
    captions: hiddenControl,
    onRenderAvatar: hiddenControl,
    isCaptionsOn: hiddenControl
  }
} as Meta;
