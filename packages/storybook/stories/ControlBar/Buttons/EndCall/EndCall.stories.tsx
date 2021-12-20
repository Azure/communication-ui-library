// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { EndCallButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
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
      <Description>
        A button to end an ongoing call. For use with the [Control
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
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, do not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={EndCallButtonCustomExampleText}>
        <EndCallButtonCustomExample />
      </Canvas>

      <Heading>EndCallButton Props</Heading>
      <Description>
        `EndCallButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/fluentui#/controls/web/button) offers, with the following additional
        properties.
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
  title: `${COMPONENT_FOLDER_PREFIX}/Control Bar/Buttons/End Call`,
  component: EndCallButton,
  argTypes: {
    showLabel: controlsToAdd.showLabel,
    // Hiding auto-generated controls
    onHangUp: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
