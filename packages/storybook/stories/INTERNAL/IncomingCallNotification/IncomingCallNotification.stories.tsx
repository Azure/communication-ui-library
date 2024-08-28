// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification as IncomingCallNotificationComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';
import { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';
import { IncomingCallNotificationStylingExample } from './snippets/IncomingCallNotificationStyling.snippet';

const IncomingCallNotificationText: string =
  require('!!raw-loader!./snippets/IncomingCallNotification.snippet.tsx').default;
const IncomingCallNotificationStylingText: string =
  require('!!raw-loader!./snippets/IncomingCallNotificationStyling.snippet.tsx').default;
const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>IncomingCallNotification</Title>
      <SingleLineBetaBanner />
      <Description>
        This component is a representation of an incoming call. It will show the name of the caller and allow you to
        accept the call with either audio or video or reject the call. This component is used by the `IncomingCallStack`
        for each of the calls held in its state.
      </Description>
      <Canvas mdxSource={IncomingCallNotificationText}>
        <IncomingCallNotificationExample />
      </Canvas>
      <Heading>Styling</Heading>
      <Description>
        Depending on your use of `IncomingCallNotification` and the `IncomingCallStack` you might want to customize your
        notification's appearence to match your needs. Both components includes API's to adjust the CSS on many
        different elements of the notification. Below is an example of how you can customize `IncomingCallNotification`.
      </Description>
      <Canvas mdxSource={IncomingCallNotificationStylingText}>
        <IncomingCallNotificationStylingExample />
      </Canvas>
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
  id: `${COMPONENT_FOLDER_PREFIX}-Internal-InboundCalling-IncomingCallNotification`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/InboundCalling/IncomingCallNotification`,
  component: IncomingCallNotification,
  argTypes: {
    incomingCalls: controlsToAdd.incomingCalls,
    maxIncomingCallsToShow: controlsToAdd.maxIncomingCallsToShow
  },
  parameters: {
    docs: {
      page: getDocs
    }
  }
} as Meta;
