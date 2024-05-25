// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { NotificationBar as NotificationBarComponent } from '../../../../react-components/src/components';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { ExampleNotificationBar } from './snippets/ExampleNotificationBar.snippet';

const ExampleNotificationBarText = require('!!raw-loader!./snippets/ExampleNotificationBar.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Notification Bar</Title>
      <Description>
        `Notification Bar` is a container showing notification in a bar format with an icon, title, message, and a
        button. The message and button is optional.
      </Description>
      <Description>
        Toggle the `autoDismiss` prop to automatically dismiss the notification after 5 seconds. Toggle the
        `showStackedEffect` prop to show the notification in a stacked effect hinting there are more notifications
        behind it.
      </Description>
      <Heading>Example Notification Bar</Heading>
      <Canvas mdxSource={ExampleNotificationBarText}>
        <ExampleNotificationBar />
      </Canvas>
      <Heading>Notification Bar Props</Heading>
      <Props of={NotificationBarComponent} />
    </>
  );
};

const NotificationBarStory = (args): JSX.Element => {
  const containerStyles = {
    width: '100%',
    height: '100%',
    padding: '2rem'
  };

  const strings = {
    title: 'Poor Network Quality',
    closeButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    buttonLabel: 'Join by Phone'
  };

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
      <NotificationBarComponent
        notificationBarStrings={strings}
        notificationBarIconProps="ErrorBarCallNetworkQualityLow"
        onClick={() => alert('joining with phone')}
        {...args}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const NotificationBar = NotificationBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-NotificationBar`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Notifications/NotificationBar`,
  component: NotificationBarComponent,
  argTypes: {
    notificationBarStrings: hiddenControl,
    notificationBarIconProps: hiddenControl,
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
