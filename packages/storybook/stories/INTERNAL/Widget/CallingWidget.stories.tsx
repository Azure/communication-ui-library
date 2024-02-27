// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, registerIcons } from '@fluentui/react';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../../constants';
import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react/types-6-0';
import { CallingWidgetComponentMock } from './snippets/CallingWidgetComponentMock.snippet';
import { CallAdd20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { Canvas, Description, Heading, Source, Subheading, Title } from '@storybook/addon-docs';

registerIcons({
  icons: { dismiss: <Dismiss20Regular />, callAdd: <CallAdd20Regular /> }
});

const CallingWidgetComponentText = require('!!raw-loader!./snippets/CallingWidgetComponentText.snippet.tsx').default;

const endCallSubscriptionText = `
useEffect(() => {
    if (adapter) {
      adapter.on('callEnded', () => {
        /**
         * you will want to add your custom code here for after call behavior
         * from the widget
         */ 
      });
    }
  }, [adapter]);
`;

const getDocs: () => JSX.Element = () => {
  return (
    <div>
      <Title>Calling Widget</Title>
      <Description>
        The Calling Widget is a wrapper around our `CallComposite` to better facilitate calling experiences that begin
        with one click. Please check out our tutorial on how to build this from scratch on [Microsoft
        Learn](https://learn.microsoft.com/en-us/azure/communication-services/tutorials/calling-widget/calling-widget-tutorial)
      </Description>
      <Canvas mdxSource={CallingWidgetComponentText}>
        <Stack horizontalAlign="center" style={{}}>
          <Stack style={{ width: '25rem', height: '25rem', position: 'relative', margin: 'auto' }}>
            <CallingWidgetComponentMock />
          </Stack>
        </Stack>
      </Canvas>
      <Heading>Pre-requisites</Heading>
      <Description>
        There are a few things that need setting up before you can use the calling widget. These include:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>
          Setting up your{' '}
          <a
            href={
              'https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-auto-attendant'
            }
          >
            Teams Auto Attendant
          </a>{' '}
          or{' '}
          <a
            href={
              'https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-call-queue'
            }
          >
            Teams Call Queue
          </a>
        </li>

        <li>
          An Azure account with an active subscription. [Create an account for
          free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
        </li>
        <li>
          <a href={'https://nodejs.org/'}>Node.js</a> Active LTS and Maintenance LTS versions (Node 18.0.0 and above).
        </li>
        <li>
          An active Communication Services resource.{' '}
          <a
            href={
              'https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp'
            }
          >
            Create a Communication Services resource
          </a>
          .
        </li>
      </ul>
      <Heading>Scenarios for using the widget</Heading>
      <Description>
        There are a lot of calling scenarios that require a quick way to start a call with little setup and speed to get
        a user in contact with support. The widget is designed to be a quick and easy way to start a call with minimal
        setup for end users. Some scenarios include:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Support chat</li>
        <li>Customer service</li>
        <li>Internal support</li>
      </ul>
      <Description>The widget allows for all of these scenarios to be embedded directly into your website.</Description>
      <Subheading>Features</Subheading>
      <Description>
        In order to facilitate these scenarios the calling widget includes the following features from the
        `CallComposite` to allow your users be supported the way you want them to.
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>
          Adhoc calling to Teams Voice applications - Teams provides solutions using a series of Call Queues and Auto
          Attendants to allow your customers connect with your agents in your{' '}
          <a
            className="sbdocs sbdocs-a"
            href="https://learn.microsoft.com/en-us/azure/communication-services/tutorials/contact-center"
          >
            Contact Center
          </a>{' '}
        </li>
        <li>Call Transfer</li>
        <li>DTMF Dialer - This is so your users can interact with Teams voice applications with DTMF or voice</li>
        <li>
          Calling sounds - We provide with the `CallComposite` the ability to set calling event sounds to provide a more
          enriching experience for your users
        </li>
      </ul>
      <Heading>How does it fit into my application? </Heading>
      <Description>
        The Calling widget is a wrapper around our CallComposite. If you are wanting to integrate this experience into
        your web application you will want to use the component in either the root of the application, or in the section
        of your website that you want it to be displayed.
      </Description>
      <Description>
        The Calling widget is intended to float on top of the page allowing the user to keep interacting with your
        product while they are in a call. It is important that the widget live somewhere where it will not be subject to
        re-renders of your application when the user interacts with other elements on the page.
      </Description>
      <Description>
        Something to keep in mind when placing the widget in your application we have minimum sizes for our
        `CallComposite`. Keeping these in mind we need to make sure that the widget has enough space to transform into
        the `CallComposite` once the call begins. The min sizes are:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Height: `352px`</li>
        <li>Width: `480px`</li>
      </ul>
      <Subheading>Using Mobile</Subheading>
      <Description>
        If you are wanting to create this experience on mobile, the recommendation here is to use the composite in the
        `mobile` formfactor. This will be the best experience for your users in a call as the widget will not be sized
        well for mobile devices.
      </Description>
      <Heading>Before and after the call</Heading>
      <Subheading>Before the Call</Subheading>
      <Description>
        When setting up your widget before the call it is important to understand the different information that you
        might want to ask the user. Our widget asks for consent to record the call, their name, and whether they want
        video controls. This is a good place to ask for information from that user like:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Customer issue - By providing more context to your Agents you can better serve your customer</li>
        <li>
          Customer email - Should there be an issue or a need for a followup collecting user contact information can
          improve your ability to serve your customers if its a complex issue
        </li>
      </ul>
      <Description>
        These different fields for the user are the configuration screen for the user as the widget skips the
        `CallComposite` configuration screen. If you are collecting information from the user you will want to make sure
        that you are storing that information in a secure way.
      </Description>
      <Subheading>After the Call</Subheading>
      <Description>
        Following the call you can provide many different options for the user. Using the `onCallEnded` event from the
        `CallAdapter` you can provide a survey, or other options for the user to provide feedback on the call. you can
        do that with the following code:
      </Description>
      <Source code={endCallSubscriptionText}></Source>
      <Heading>Cleaning up</Heading>
      <Description>
        After the call is over it is important to clean up the widget and make sure that the user is ready to start a
        new call. This includes cleaning up the adapter and the state of the widget. This is important so that the user
        is ready to start a new call.
      </Description>
    </div>
  );
};

const WidgetStory: () => JSX.Element = () => {
  return (
    <Stack style={{ width: '30rem', height: '30rem', position: 'relative' }}>
      <CallingWidgetComponentMock />
    </Stack>
  );
};

export const Widget = WidgetStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-internal-widget`,
  title: `${COMPOSITE_FOLDER_PREFIX}/internal/Widget`,
  component: CallComposite,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
