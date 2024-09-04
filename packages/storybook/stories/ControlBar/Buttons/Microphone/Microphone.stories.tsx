// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MicrophoneButton, MicrophoneButtonProps } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import {
  controlsToAdd,
  defaultControlsMicrophones,
  defaultControlsSpeakers,
  hiddenControl
} from '../../../controlsUtils';
import { CustomMicrophoneButtonExample } from './snippets/Custom.snippet';
import { MicrophoneButtonExample } from './snippets/Default.snippet';
import { MicrophoneButtonWithDevicesMenuExample } from './snippets/WithDevicesMenu.snippet';
import { MicrophoneButtonWithLabelExample } from './snippets/WithLabel.snippet';

const CustomMicrophoneButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const MicrophoneButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const ButtonWithDevicesMenuExampleText = require('!!raw-loader!./snippets/WithDevicesMenu.snippet.tsx').default;
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

      <Heading>Microphone with device selection menu</Heading>
      <Description>
        `MicrophoneButton` can be optionally rendered as a split button. The secondary button in this mode opens a menu
        where users can select the audio devices to use. To render `MicrophoneButton` in this mode, set the
        `enableDeviceSelectionMenu` prop to `true`.
      </Description>
      <Canvas mdxSource={ButtonWithDevicesMenuExampleText}>
        <MicrophoneButtonWithDevicesMenuExample />
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
  return <MicrophoneButtonWithDevices {...args} />;
};

const MicrophoneButtonWithDevices = (props: MicrophoneButtonProps): JSX.Element => {
  const [selectedMicrophone, setSelectedMicrophone] = useState<{ id: string; name: string }>(
    defaultControlsMicrophones[0]
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<{ id: string; name: string }>(defaultControlsSpeakers[0]);

  const deviceProps: MicrophoneButtonProps = {
    selectedMicrophone: selectedMicrophone,
    selectedSpeaker: selectedSpeaker,
    onSelectMicrophone: async (device: { id: string; name: string }) => {
      setSelectedMicrophone(device);
    },
    onSelectSpeaker: async (device: { id: string; name: string }) => {
      setSelectedSpeaker(device);
    },
    onToggleMicrophone: async (): Promise<void> => {
      /* Need a defined callback to show split button */
    }
  };

  return <MicrophoneButton {...props} {...deviceProps} />;
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
    microphones: controlsToAdd.microphones,
    speakers: controlsToAdd.speakers,
    // Hiding auto-generated controls
    onToggleMicrophone: hiddenControl,
    selectedMicrophone: hiddenControl,
    selectedSpeaker: hiddenControl,
    onSelectMicrophone: hiddenControl,
    onSelectSpeaker: hiddenControl,
    strings: hiddenControl,
    styles: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
