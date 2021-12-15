// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MicrophoneButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
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
      <Description>
        A button to toggle the user's microphone on and off. For use with the [Control
        Bar](./?path=/docs/ui-components-controlbar--control-bar).
      </Description>
      <Description>
        Note that for accessibility purposes, this button can be focused on even when disabled. This behaviour can be
        changed by setting the button prop `allowDisabledFocus` to `false`.
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
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, do not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={CustomMicrophoneButtonExampleText}>
        <CustomMicrophoneButtonExample />
      </Canvas>

      <Heading>MicrophoneButton Props</Heading>
      <Description>
        `MicrophoneButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/fluentui#/controls/web/button) offers, with the additional following
        properties.
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
  title: `${COMPONENT_FOLDER_PREFIX}/Control Bar/Buttons/Microphone`,
  component: MicrophoneButton,
  argTypes: {
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    // Hiding auto-generated controls
    onToggleMicrophone: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
