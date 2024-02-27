// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, registerIcons } from '@fluentui/react';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../../constants';
import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react/types-6-0';
import { CallingWidgetComponentMock } from './snippets/CallingWidgetComponentMock.snippet';
import { CallAdd20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { Canvas, Description, Heading, Subheading, Title } from '@storybook/addon-docs';

registerIcons({
  icons: { dismiss: <Dismiss20Regular />, callAdd: <CallAdd20Regular /> }
});

const CallingWidgetComponentText = require('!!raw-loader!./snippets/CallingWidgetComponentText.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <div>
      <Title>Calling Widget</Title>
      <Description>
        The Calling Widget is a wrapper around our `CallComposite` to better facilitate calling experiences that begin
        with one click.
      </Description>
      <Canvas mdxSource={CallingWidgetComponentText}>
        <Stack horizontalAlign="center" style={{}}>
          <Stack style={{ width: '25rem', height: '25rem', position: 'relative', margin: 'auto' }}>
            <CallingWidgetComponentMock />
          </Stack>
        </Stack>
      </Canvas>
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
      <Heading>Before and after the call</Heading>
      <Subheading>Before the Call</Subheading>
      <Description>
        When setting up your widget before the call it is important to understand the different information that you
        might want to ask the user. This is a good place to ask for information from that user like:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Customer issue - By providing more context to your Agents you can better serve your customer</li>
        <li>
          Customer email - Should there be an issue or a need for a followup collecting user contact information can
          improve your ability to serve your customers if its a complex issue
        </li>
        <li>
          Consent to recording the call - It is important that you let your users know if you are going to record the
          call for quality, or other reasons so make sure to do this so your customers know.
        </li>
        <li>
          Use of their camera - different scenarios might require use of the camera but this is not required, the widget
          is setup to allow the user to do this.
        </li>
      </ul>

      <Subheading>After the Call</Subheading>
      <Heading>Cleaning up</Heading>
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
