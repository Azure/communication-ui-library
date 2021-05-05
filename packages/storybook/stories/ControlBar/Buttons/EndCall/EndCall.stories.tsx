// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EndCallButton } from 'react-components';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { EndCallButtonExample } from './snippets/EndCallButton.snippet';
import { EndCallButtonWithLabelExample } from './snippets/EndCallButtonWithLabel.snippet';
import { CustomEndCallButtonExample } from './snippets/CustomEndCallButton.snippet';

const EndCallButtonExampleText = require('!!raw-loader!./snippets/EndCallButton.snippet.tsx').default;
const EndCallButtonWithLabelExampleText = require('!!raw-loader!./snippets/EndCallButtonWithLabel.snippet.tsx').default;
const CustomEndCallButtonExampleText = require('!!raw-loader!./snippets/CustomEndCallButton.snippet.tsx').default;

const importStatement = `
import { EndCallButton, FluentThemeProvider } from 'react-components';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>EndCallButton</Title>
      <Description of={EndCallButton} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `EndCallButton` component shows a hangup icon with no label as in the example below.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <EndCallButtonExample />
      </Canvas>
      <Source code={EndCallButtonExampleText} />

      <Heading>EndCallButton with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Hangup`.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <EndCallButtonWithLabelExample />
      </Canvas>
      <Source code={EndCallButtonWithLabelExampleText} />

      <Heading>Custom EndCallButton Styles</Heading>
      <Description>
        You can change the styles of the `EndCallButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <CustomEndCallButtonExample />
      </Canvas>
      <Source code={CustomEndCallButtonExampleText} />

      <Heading>EndCallButton Props</Heading>
      <Description>
        `EndCallButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the additional
        following properties.
      </Description>
      <Props of={EndCallButton} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const EndCall = (): JSX.Element => {
  const showLabels = boolean('Show Labels', false);

  return <EndCallButton showLabel={showLabels} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/End Call`,
  component: EndCallButton,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
