// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CameraButton } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { CustomCameraButtonExample } from './snippets/Custom.snippet';
import { CameraButtonExample } from './snippets/Default.snippet';
import { CameraButtonWithLabelExample } from './snippets/WithLabel.snippet';

const CustomButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const DefaultButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const ButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { CameraButton } from '@azure/communication-ui';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>CameraButton</Title>
      <Description of={CameraButton} />
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, don not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `CameraButton` component shows a Camera icon with no label. The following example displays the
        `CameraButton` with camera turned on and off.
      </Description>
      <Canvas mdxSource={DefaultButtonExampleText}>
        <CameraButtonExample />
      </Canvas>

      <Heading>Camera with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Turn on` or `Turn off`.
      </Description>
      <Canvas mdxSource={ButtonWithLabelExampleText}>
        <CameraButtonWithLabelExample />
      </Canvas>

      <Heading>Custom CameraButton Styles</Heading>
      <Description>
        You can change the styles of the `CameraButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas mdxSource={CustomButtonExampleText}>
        <CustomCameraButtonExample />
      </Canvas>

      <Heading>CameraButton Props</Heading>
      <Description>
        `CameraButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the following
        additional properties:
      </Description>
      <Props of={CameraButton} />
    </>
  );
};

const CameraStory = (args): JSX.Element => {
  return <CameraButton {...args} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Camera = CameraStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-camera`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Camera`,
  component: CameraButton,
  argTypes: {
    checked: { control: 'boolean', defaultValue: false, name: 'Is checked' },
    showLabel: { control: 'boolean', defaultValue: false, name: 'Show label' },
    // Hiding auto-generated controls
    onToggleCamera: { control: false, table: { disable: true } },
    localVideoViewOption: { control: false, table: { disable: true } },
    strings: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    },
    storyshots: { disable: true }
  }
} as Meta;
