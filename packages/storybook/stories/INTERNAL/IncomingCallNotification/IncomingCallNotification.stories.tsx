// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification as IncomingCallNotificationComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';
import { IncomingCallNotificationStylingExample } from './snippets/IncomingCallNotificationStyling.snippet';

const IncomingCallNotificationText = require('!!raw-loader!./snippets/IncomingCallNotification.snippet').default;
const IncomingCallNotificationStylingText =
  require('!!raw-loader!./snippets/IncomingCallNotificationStyling.snippet').default;
const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Incoming Call Notification Component</Title>
      <SingleLineBetaBanner />
      <Description>
        The incoming Call notification component is used to provide information to your users when they are recieving a
        call. This UI component is to be used to represent a single incoming call.
      </Description>
      <Canvas mdxSource={IncomingCallNotificationText}>
        <IncomingCallNotificationExample />
      </Canvas>
      <Heading>Styling</Heading>
      <Description>
        Depending on your use of incoming call notification you might want to customize it to your needs. The component
        includes API's to adjust the CSS on many different elements of the component. Below is an example of how you can
        customize incoming call notification.
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
      acceptOptions={{
        showAcceptWithVideo: true
      }}
    />
  );
};

export const IncomingCallNotification = IncomingCallNotificationStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-Internal-IncomingCallNotification`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/IncomingCallNotification`,
  component: IncomingCallNotification,
  parameters: {
    docs: {
      page: getDocs
    }
  }
} as Meta;
