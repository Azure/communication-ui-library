// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MicrophoneButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { CustomMicrophoneButtonExample } from './snippets/Custom.snippet';
import { MicrophoneButtonExample } from './snippets/Default.snippet';
import { MicrophoneButtonWithLabelExample } from './snippets/WithLabel.snippet';

const CustomMicrophoneButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const MicrophoneButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const MicrophoneButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { MicrophoneButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MicrophoneButton</Title>
      <Description of={MicrophoneButton} />
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, don not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `MicrophoneButton` component shows a microphone icon with no label. The following example displays
        an unmuted `MicrophoneButton` and a muted `MicrophoneButton`.
      </Description>
      <Canvas mdxSource={MicrophoneButtonExampleText}>
        <MicrophoneButtonExample />
      </Canvas>

      <Heading>Microphone with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Mute` or `Unmute`.
      </Description>
      <Canvas mdxSource={MicrophoneButtonWithLabelExampleText}>
        <MicrophoneButtonWithLabelExample />
      </Canvas>

      <Heading>Custom MicrophoneButton Styles</Heading>
      <Description>
        You can change the styles of the `MicrophoneButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas mdxSource={CustomMicrophoneButtonExampleText}>
        <CustomMicrophoneButtonExample />
      </Canvas>

      <Heading>MicrophoneButton Props</Heading>
      <Description>
        `MicrophoneButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the additional
        following properties.
      </Description>
      <Props of={MicrophoneButton} />
    </>
  );
};

const MicrophoneStory = (args): JSX.Element => {
  return <MicrophoneButton {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Microphone = MicrophoneStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-microphone`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Microphone`,
  component: MicrophoneButton,
  argTypes: {
    checked: { control: 'boolean', defaultValue: false, name: 'Is checked' },
    showLabel: { control: 'boolean', defaultValue: false, name: 'Show label' },
    // Hiding auto-generated controls
    onToggleMicrophone: { control: false, table: { disable: true } },
    strings: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
