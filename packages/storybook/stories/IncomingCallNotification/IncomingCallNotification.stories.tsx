// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification as IncomingCallNotificationComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
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
        Depoending on your use of the incoming call notification you might want to customize it to your needs. On the
        component we have many different API's to adjust the CSS of the different elements of the component. Below is an
        example of how you can customize the incoming call notification.
      </Description>
      <Canvas>
        <IncomingCallNotificationStylingExample />
      </Canvas>
      <Source code={IncomingCallNotificationStylingText}></Source>
      <Heading>Props</Heading>
      <Props of={IncomingCallNotificationComponent}></Props>
    </>
  );
};

const IncomingCallNotificationStory = (): JSX.Element => {
  return (
    <IncomingCallNotificationComponent
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

export const IncomingCallNotification = IncomingCallNotificationStory.bind({});

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
