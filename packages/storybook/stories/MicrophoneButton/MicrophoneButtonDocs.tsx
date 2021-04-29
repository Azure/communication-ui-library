// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { MicrophoneButton } from '../../../communication-ui/src';
import { MicrophoneButtonExample } from './snippets/MicrophoneButton.snippet';
import { MicrophoneButtonWithLabelExample } from './snippets/MicrophoneButtonWithLabel.snippet';
import { CustomMicrophoneButtonExample } from './snippets/CustomMicrophoneButton.snippet';
const MicrophoneButtonExampleText = require('!!raw-loader!./snippets/MicrophoneButton.snippet.tsx').default;
const MicrophoneButtonWithLabelExampleText = require('!!raw-loader!./snippets/MicrophoneButtonWithLabel.snippet.tsx')
  .default;
const CustomMicrophoneButtonExampleText = require('!!raw-loader!./snippets/CustomMicrophoneButton.snippet.tsx').default;

const importStatement = `
import { MicrophoneButton } from '@azure/communication-ui';
`;

export const getDocs: () => JSX.Element = () => {
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
      <Canvas withSource={SourceState.NONE}>
        <MicrophoneButtonExample />
      </Canvas>
      <Source code={MicrophoneButtonExampleText} />

      <Heading>Microphone with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as 'Mute' or 'Unmute'.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <MicrophoneButtonWithLabelExample />
      </Canvas>
      <Source code={MicrophoneButtonWithLabelExampleText} />

      <Heading>Custom MicrophoneButton Styles</Heading>
      <Description>
        You can change the styles of the `MicrophoneButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas withSource={SourceState.NONE}>
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
