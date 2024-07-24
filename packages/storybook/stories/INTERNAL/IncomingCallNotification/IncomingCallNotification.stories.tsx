// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IncomingCallNotification as IncomingCallNotificationComponent,
  IncomingCallStack
} from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';
import { IncomingCallNotificationStylingExample } from './snippets/IncomingCallNotificationStyling.snippet';
import { IncomingCallStackExample } from './snippets/IncomingCallStack.snippet';

const IncomingCallNotificationText: string =
  require('!!raw-loader!./snippets/IncomingCallNotification.snippet.tsx').default;
const IncomingCallNotificationStylingText: string =
  require('!!raw-loader!./snippets/IncomingCallNotificationStyling.snippet.tsx').default;
const IncomingCallStackExampleText: string =
  require('!!raw-loader!./snippets/IncomingCallStackPropsExample.snippet.tsx').default;
const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Inbound Calling</Title>
      <SingleLineBetaBanner />
      <Description>
        Azure Communication Services UI Library is adding support for Inbound Calling. With this new feature, users will
        be able to see and monitor new incoming calls when signed in to ACS or Teams as a Communication as a Teams User.
        Users will be able to Accept with Audio, Accept with video, and reject incoming calls.
      </Description>
      <Description>
        Enabling this feature will allow them see multiple incoming calls allowing the user to service multiple people
        at once best supporting the people that want to get in touch. In any scenario when your user’s are logged in you
        are able to Accept or reject calls based on your user’s needs.
      </Description>
      <Heading>Incorporating Inbound Calling into your Experience</Heading>
      <Description>
        Currently the UI library exports a series of components like the [Video
        Gallery](./?path=/docs/ui-components-videogallery--video-gallery) or
        [CallControls](./?path=/docs/ui-components-controlbar--control-bar) that allow you to build a Video calling
        experience that you can join through our [stateful client](./?path=/docs/quickstarts-statefulcallclient--page).
        With the introduction of these components we are also allowing you to attach to your experience a way to have
        the calls come to you through these new react components. We are adding this capability with the new
        `IncomingCallStack` and `IncomingCallNotification` Component. These new components will allow you to accept,
        accept with video, or reject the call. Accepting will bring you straight into the call.
      </Description>
      <Heading>IncomingCallStack</Heading>
      <Description>
        This component is a manager for your different incoming calls. It will render the different calls using the
        `IncomingCallNotification` component. Using the `usePropsFor` hook it will be able to get these calls from the
        statefulcallclient and render them in the UI. This component will allow you to manage multiple incoming calls.
      </Description>
      <Canvas mdxSource={IncomingCallStackExampleText}>
        <IncomingCallStackExample />
      </Canvas>
      <Props of={IncomingCallStack}></Props>
      <Heading>IncomingCallNotification</Heading>
      <Description></Description>
      <Canvas mdxSource={IncomingCallNotificationText}>
        <IncomingCallNotificationExample />
      </Canvas>
      <Heading>Styling</Heading>
      <Description>
        Depending on your use of incoming call notification you might want to customize it to your needs. The component
        includes API's to adjust the CSS on many different elements of the component. Below is an example of how you can
        customize incoming call notification.
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
