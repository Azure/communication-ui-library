// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { EndCallButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { EndCallButtonCustomExample } from './snippets/Custom.snippet';
import { EndCallButtonDefaultExample } from './snippets/Default.snippet';
import { EndCallButtonWithLabelExample } from './snippets/WithLabel.snippet';

const EndCallButtonCustomExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const EndCallButtonDefaultExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const EndCallButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { EndCallButton, FluentThemeProvider } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>EndCallButton</Title>
      <Description of={EndCallButton} />
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, don not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `EndCallButton` component shows a hangup icon with no label as in the example below.
      </Description>
      <Canvas mdxSource={EndCallButtonDefaultExampleText}>
        <EndCallButtonDefaultExample />
      </Canvas>

      <Heading>EndCallButton with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Hangup`.
      </Description>
      <Canvas mdxSource={EndCallButtonWithLabelExampleText}>
        <EndCallButtonWithLabelExample />
      </Canvas>

      <Heading>Custom EndCallButton Styles</Heading>
      <Description>
        You can change the styles of the `EndCallButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas mdxSource={EndCallButtonCustomExampleText}>
        <EndCallButtonCustomExample />
      </Canvas>

      <Heading>EndCallButton Props</Heading>
      <Description>
        `EndCallButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the following
        additional properties.
      </Description>
      <Props of={EndCallButton} />
    </>
  );
};

const EndCallStory = (args): JSX.Element => {
  return <EndCallButton {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const EndCall = EndCallStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-endcall`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/End Call`,
  component: EndCallButton,
  argTypes: {
    showLabel: { control: 'boolean', defaultValue: false, name: 'Show label' },
    // Hiding auto-generated controls
    onHangUp: { control: false, table: { disable: true } },
    strings: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
