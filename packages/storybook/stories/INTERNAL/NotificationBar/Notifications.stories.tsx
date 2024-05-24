// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, useTheme } from '@fluentui/react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { Notifications as NotificationsComponent } from '../../../../react-components/src/components';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { ExampleNotifications } from './snippets/ExampleNotifications.snippet';

const ExampleNotificationsText = require('!!raw-loader!./snippets/ExampleNotifications.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Notifications</Title>
      <Description>
        `Notifications` is a wrapper on the `NotificationBar` component with additional features for surfacing Azure
        Communication Services notifications on the UI consistently.
      </Description>
      <Heading>Example Notifications</Heading>
      <Canvas mdxSource={ExampleNotificationsText}>
        <ExampleNotifications />
      </Canvas>
      <Heading>Localization</Heading>
      <Description>
        Similar to other UI components in this library, `NotificationsProps` accepts all strings shown on the UI as a
        `strings` field. The `activeNotifications` field selects from these strings to show in the `Notifications` UI.
      </Description>
      <Heading>Dismissed messages</Heading>
      <Description>
        User can dismiss the notifications shown by clicking on the X icon. If you wish to dismiss the notifications
        automatically, simply set the `autoDismiss` field to true for that specific notification.
      </Description>
      <Heading>Multiple Notifications</Heading>
      <Description>
        More than one notification can occur at the same time. The `Notifications` component can show multiple active
        notifications. To avoid confusing the user, it is important to be mindful to limit the total number of
        notifications that are shown together by setting the `maxNotificationsToShow` field.
      </Description>
      <Heading>Notifications Props</Heading>
      <Props of={NotificationsComponent} />
    </>
  );
};

const NotificationsStory = (args): JSX.Element => {
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
      <NotificationsComponent
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
export const Notifications = NotificationsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-Notifications`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Notifications/Notifications`,
  component: NotificationsComponent,
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
