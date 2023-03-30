// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ScreenShareButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { CustomScreenShareButtonExample } from './snippets/Custom.snippet';
import { ScreenShareButtonExample } from './snippets/Default.snippet';
import { ScreenShareButtonWithLabelExample } from './snippets/WithLabel.snippet';

const CustomButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const DefaultButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const ButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { ScreenShareButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ScreenShareButton</Title>
      <Description>
        A button to toggle the user's screen sharing on and off. For use with the [Control
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
        The default `ScreenShareButton` component shows a ScreenShare icon with no label. The following example displays
        the `ScreenShareButton` with screen sharing enabled and disabled.
      </Description>
      <Canvas mdxSource={DefaultButtonExampleText}>
        <ScreenShareButtonExample />
      </Canvas>

      <Heading>ScreenShare with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Share` or `Stop`.
      </Description>
      <Canvas mdxSource={ButtonWithLabelExampleText}>
        <ScreenShareButtonWithLabelExample />
      </Canvas>

      <Heading>Custom ScreenShareButton Styles</Heading>
      <Description>
        You can change the styles of the `ScreenShareButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, do not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>
      <Canvas mdxSource={CustomButtonExampleText}>
        <CustomScreenShareButtonExample />
      </Canvas>

      <Heading>ScreenShareButton Props</Heading>
      <Description>
        `ScreenShareButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/fluentui#/controls/web/button) offers, with the following additional
        properties:
      </Description>
      <Props of={ScreenShareButton} />
    </>
  );
};

const ScreenShareStory = (args): JSX.Element => {
  return <ScreenShareButton {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ScreenShare = ScreenShareStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-screenshare`,
  title: `${COMPONENT_FOLDER_PREFIX}/Control Bar/Buttons/Screen Share`,
  component: ScreenShareButton,
  argTypes: {
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    // Hiding auto-generated controls
    onToggleScreenShare: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
