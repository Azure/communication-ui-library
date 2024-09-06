// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, useTheme } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { NotificationStack as NotificationStackComponent } from '../../../react-components/src/components';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { ExampleNotificationStack } from './snippets/ExampleNotificationStack.snippet';

const ExampleNotificationStackText = require('!!raw-loader!./snippets/ExampleNotificationStack.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Notification Stack</Title>
      <Description>
        `Notification Stack` is a wrapper on the `Notification` component with additional features for surfacing Azure
        Communication Services notifications on the UI consistently.
      </Description>
      <Heading>Example Notification Stack</Heading>
      <Canvas mdxSource={ExampleNotificationStackText}>
        <ExampleNotificationStack />
      </Canvas>
      <Heading>Localization</Heading>
      <Description>
        Similar to other UI components in this library, `NotificationStackProps` accepts all strings shown on the UI as
        a `strings` field. The `activeNotifications` field selects from these strings to show in the `NotificationStack`
        UI.
      </Description>
      <Heading>Dismissed messages</Heading>
      <Description>
        User can dismiss the notifications shown by clicking on the X icon. If you wish to dismiss the notifications
        automatically, simply set the `autoDismiss` field to true for that specific notification.
      </Description>
      <Heading>Tracking dismissed messages</Heading>
      <Description>
        The `NotificationStack` component internally tracks dismissed notifications and only shows a `Notification` for
        notifications that have not been dismissed. When `activeNotifications` include a timestamp, notifications that
        occur after the latest dismissal are shown on the UI. When `activeNotifications` do not include a timestamp, a
        dismissed notification is only shown on the UI if it is removed from the active notifications and if it occurs
        again.
      </Description>
      <Heading>Multiple Notification Stack</Heading>
      <Description>
        More than one notification can occur at the same time. The `NotificationStack` component can show multiple
        active notifications. To avoid confusing the user, it is important to be mindful to limit the total number of
        notifications that are shown together by setting the `maxNotificationsToShow` field.
      </Description>
      <Heading>Notification Stack Props</Heading>
      <Props of={NotificationStackComponent} />
    </>
  );
};

const NotificationStackStory = (args): JSX.Element => {
  const theme = useTheme();
  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '50%'
      })}
    >
      <NotificationStackComponent
        activeNotifications={args.activeNotifications.map((t) => ({
          type: t
        }))}
        maxNotificationsToShow={args.maxNotificationsToShow}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const NotificationStack = NotificationStackStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-NotificationStack`,
  title: `${COMPONENT_FOLDER_PREFIX}/Notifications/NotificationStack`,
  component: NotificationStackComponent,
  argTypes: {
    activeNotifications: controlsToAdd.activeNotifications,
    maxNotificationsToShow: controlsToAdd.maxNotificationsToShow,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
