// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, registerIcons } from '@fluentui/react';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../../constants';
import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react/types-6-0';
import { CallingWidgetComponentMock } from './snippets/CallingWidgetComponentMock.snippet';
import { CallAdd20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { Canvas, Description, Heading, Title } from '@storybook/addon-docs';

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
      <Heading>How does it fit into my application? </Heading>
      <Heading>Before and after the call</Heading>
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
