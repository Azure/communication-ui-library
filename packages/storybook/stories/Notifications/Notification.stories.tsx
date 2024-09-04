// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { Notification as NotificationComponent } from '../../../react-components/src/components';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { ExampleNotification } from './snippets/ExampleNotification.snippet';

const ExampleNotificationText = require('!!raw-loader!./snippets/ExampleNotification.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Notification</Title>
      <Description>
        `Notification` is a container showing notification in a bar format with an icon, title, message, and 2 buttons.
        The message and buttons are optional.
      </Description>
      <Description>
        Toggle the `autoDismiss` prop to automatically dismiss the notification after 5 seconds. Toggle the
        `showStackedEffect` prop to show the notification in a stacked effect hinting there are more notifications
        behind it.
      </Description>
      <Heading>Example Notification</Heading>
      <Canvas mdxSource={ExampleNotificationText}>
        <ExampleNotification />
      </Canvas>
      <Heading>Notification Props</Heading>
      <Props of={NotificationComponent} />
    </>
  );
};

const NotificationStory = (args): JSX.Element => {
  const containerStyles = {
    width: '100%',
    height: '100%',
    padding: '2rem'
  };

  const strings = {
    title: 'Poor Network Quality',
    dismissButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    primaryButtonLabel: 'Join by Phone',
    secondaryButtonLabel: 'I will wait :)'
  };

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
      <NotificationComponent
        notificationStrings={strings}
        notificationIconProps="ErrorBarCallNetworkQualityLow"
        onClickPrimaryButton={() => alert('Joining with phone')}
        onClickSecondaryButton={() => alert('I will wait')}
        {...args}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Notification = NotificationStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-Notification`,
  title: `${COMPONENT_FOLDER_PREFIX}/Notifications/Notification`,
  component: NotificationComponent,
  argTypes: {
    notificationStrings: hiddenControl,
    notificationIconProps: hiddenControl,
    autoDismiss: controlsToAdd.isNotificationAutoDismiss,
    showStackedEffect: controlsToAdd.showNotificationStacked,
    onClick: hiddenControl,
    onDismiss: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
