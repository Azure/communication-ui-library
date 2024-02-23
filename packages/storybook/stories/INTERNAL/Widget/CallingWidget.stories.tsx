// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, registerIcons } from '@fluentui/react';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../../constants';
import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react/types-6-0';
import { CallingWidgetComponent } from './snippets/CallingWidgetComponent.snippet';
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
            <CallingWidgetComponent />
          </Stack>
        </Stack>
      </Canvas>
      <Heading>Scenarios for using the widget</Heading>
    </div>
  );
};

const WidgetStory: () => JSX.Element = () => {
  return (
    <Stack style={{ width: '30rem', height: '30rem', position: 'relative' }}>
      <CallingWidgetComponent />
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
