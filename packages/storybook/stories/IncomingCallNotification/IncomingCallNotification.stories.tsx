// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification } from '@azure/communication-react';
import { Canvas, Description, Heading, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';
import { IncomingCallNotificationStylingExample } from './snippets/IncomingCallNotificationStyling.snippet';

const IncomingCallNotificationText = require('!!raw-loader!./snippets/IncomingCallNotification.snippet').default;
const IncomingCallNotificationStylingText =
  require('!!raw-loader!./snippets/IncomingCallNotificationStyling.snippet').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Incoming Call Notifiation Component</Title>
      <Description>
        The incoming Call notification component is used to provide information to your users when they are recieving a
        call. This UI component is to be used to represent a single incoming call.
      </Description>
      <Canvas mdxSource={IncomingCallNotificationText}>
        <IncomingCallNotificationExample />
      </Canvas>
      <Heading>Styling</Heading>
      <Description>
        Using the `styles` prop, you can customize the look and feel of the Incoming Call Notification
      </Description>
      <Canvas>
        <IncomingCallNotificationStylingExample />
      </Canvas>
    </>
  );
};

const IncomingCallNotificationStory = (): JSX.Element => {
  return (
    <IncomingCallNotification
      onAcceptWithAudio={function (): void {
        alert('Accept with audio');
      }}
      onAcceptWithVideo={function (): void {
        alert('Accept with video');
      }}
      onReject={function (): void {
        alert('Rejected');
      }}
      callerName="John Wick"
    />
  );
};

export const IncomingNotification = IncomingCallNotificationStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-IncomingCallNotification`,
  title: `${COMPONENT_FOLDER_PREFIX}/IncomingCallNotification`,
  component: IncomingCallNotification,
  parameters: {
    docs: {
      page: getDocs
    }
  }
} as Meta;
