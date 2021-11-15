// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DevicesButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { DevicesButtonCustomExample } from './snippets/Custom.snippet';
import { DevicesButtonDefaultExample } from './snippets/Default.snippet';
import { DevicesButtonWithKnobs } from './snippets/DevicesButtonWithKnobs.snippet';
import { DevicesButtonWithLabelExample } from './snippets/WithLabel.snippet';

const DevicesButtonCustomExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const DevicesButtonDefaultExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const DevicesButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { DevicesButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>DevicesButton</Title>
      <Description>
        A button to open a menu that allows for device selection. For use with the [Control
        Bar](./?path=/docs/ui-components-controlbar--control-bar).
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `DevicesButton` component shows an horizontal `More` icon with no label as in the example below.
      </Description>
      <Canvas mdxSource={DevicesButtonDefaultExampleText}>
        <DevicesButtonDefaultExample />
      </Canvas>

      <Heading>DevicesButton with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Devices`.
      </Description>
      <Canvas mdxSource={DevicesButtonWithLabelExampleText}>
        <DevicesButtonWithLabelExample />
      </Canvas>

      <Heading>Custom DevicesButton Styles</Heading>
      <Description>
        You can change the styles of the `DevicesButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, do not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={DevicesButtonCustomExampleText}>
        <DevicesButtonCustomExample />
      </Canvas>

      <Heading>DevicesButton Props</Heading>
      <Description>
        `DevicesButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/fluentui#/controls/web/button) offers, with the following additional
        properties.
      </Description>
      <Props of={DevicesButton} />
    </>
  );
};

const DevicesStory = (args): JSX.Element => {
  return <DevicesButtonWithKnobs {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Devices = DevicesStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-devices`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Devices`,
  component: DevicesButton,
  argTypes: {
    showLabel: controlsToAdd.showLabel,
    cameras: controlsToAdd.cameras,
    microphones: controlsToAdd.microphones,
    speakers: controlsToAdd.speakers,
    // Hiding auto-generated controls
    selectedMicrophone: hiddenControl,
    selectedSpeaker: hiddenControl,
    selectedCamera: hiddenControl,
    onSelectCamera: hiddenControl,
    onSelectMicrophone: hiddenControl,
    onSelectSpeaker: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
