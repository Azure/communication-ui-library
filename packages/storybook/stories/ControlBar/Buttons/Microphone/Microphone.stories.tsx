// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MicrophoneButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { CustomMicrophoneButtonExample } from './snippets/CustomMicrophoneButton.snippet';
import { MicrophoneButtonExample } from './snippets/MicrophoneButton.snippet';
import { MicrophoneButtonWithLabelExample } from './snippets/MicrophoneButtonWithLabel.snippet';

const CustomMicrophoneButtonExampleText = require('!!raw-loader!./snippets/CustomMicrophoneButton.snippet.tsx').default;
const MicrophoneButtonExampleText = require('!!raw-loader!./snippets/MicrophoneButton.snippet.tsx').default;
const MicrophoneButtonWithLabelExampleText = require('!!raw-loader!./snippets/MicrophoneButtonWithLabel.snippet.tsx')
  .default;

const importStatement = `
import { MicrophoneButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MicrophoneButton</Title>
      <Description of={MicrophoneButton} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `MicrophoneButton` component shows a microphone icon with no label. The following example displays
        an unmuted `MicrophoneButton` and a muted `MicrophoneButton`.
      </Description>
      <Canvas withSource={SourceState.NONE as any}>
        <MicrophoneButtonExample />
      </Canvas>
      <Source code={MicrophoneButtonExampleText} />

      <Heading>Microphone with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Mute` or `Unmute`.
      </Description>
      <Canvas withSource={SourceState.NONE as any}>
        <MicrophoneButtonWithLabelExample />
      </Canvas>
      <Source code={MicrophoneButtonWithLabelExampleText} />

      <Heading>Custom MicrophoneButton Styles</Heading>
      <Description>
        You can change the styles of the `MicrophoneButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas withSource={SourceState.NONE as any}>
        <CustomMicrophoneButtonExample />
      </Canvas>
      <Source code={CustomMicrophoneButtonExampleText} />

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

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Microphone = (): JSX.Element => {
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  return <MicrophoneButton showLabel={showLabels} checked={toggleButtons} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Microphone`,
  component: MicrophoneButton,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
