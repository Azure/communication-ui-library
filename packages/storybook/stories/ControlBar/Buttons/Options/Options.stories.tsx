// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OptionsButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { OptionsButtonCustomExample } from './snippets/Custom.snippet';
import { OptionsButtonDefaultExample } from './snippets/Default.snippet';
import { OptionsButtonWithKnobs } from './snippets/OptionsButtonWithKnobs.snippet';
import { OptionsButtonWithLabelExample } from './snippets/WithLabel.snippet';

const OptionsButtonCustomExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const OptionsButtonDefaultExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const OptionsButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { OptionsButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>OptionsButton</Title>
      <Description of={OptionsButton} />
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, don not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `OptionsButton` component shows an horizontal `More` icon with no label as in the example below.
      </Description>
      <Canvas mdxSource={OptionsButtonDefaultExampleText}>
        <OptionsButtonDefaultExample />
      </Canvas>

      <Heading>OptionsButton with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Options`.
      </Description>
      <Canvas mdxSource={OptionsButtonWithLabelExampleText}>
        <OptionsButtonWithLabelExample />
      </Canvas>

      <Heading>Custom OptionsButton Styles</Heading>
      <Description>
        You can change the styles of the `OptionsButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas mdxSource={OptionsButtonCustomExampleText}>
        <OptionsButtonCustomExample />
      </Canvas>

      <Heading>OptionsButton Props</Heading>
      <Description>
        `OptionsButton` features all props a [FluentUI
        Button](https://developer.microsoft.com//fluentui#/controls/web/button) offers, with the following additional
        properties.
      </Description>
      <Props of={OptionsButton} />
    </>
  );
};

const OptionsStory = (args): JSX.Element => {
  return <OptionsButtonWithKnobs {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Options = OptionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-options`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Options`,
  component: OptionsButton,
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
