// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButton } from '@azure/communication-react';
import { Airplane20Filled, VehicleBus20Filled, VehicleShip20Filled } from '@fluentui/react-icons';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { CustomControlBarButtonExample } from './snippets/Custom.snippet';
import { ControlBarButtonExample } from './snippets/Default.snippet';
import { ControlBarButtonWithLabelExample } from './snippets/WithLabel.snippet';

const CustomControlBarButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const ControlBarButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const ControlBarButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;

const importStatement = `
import { ControlBarButton } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ControlBarButton</Title>
      <Description of={ControlBarButton} />
      <Description>
        Note: When overriding a render, like using `onRenderIcon` or `onRenderText`, do not forget to add a unique key
        to each element to avoid warning for children in a list.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>Here we see a `ControlBarButton` with some custom icons set:</Description>
      <Canvas mdxSource={ControlBarButtonExampleText}>
        <ControlBarButtonExample />
      </Canvas>

      <Heading>ControlBar with default label</Heading>
      <Description>Here we see the same icons but with labels set to show:</Description>
      <Canvas mdxSource={ControlBarButtonWithLabelExampleText}>
        <ControlBarButtonWithLabelExample />
      </Canvas>

      <Heading>Custom ControlBarButton Styles</Heading>
      <Description>
        You can override the styles of the `ControlBarButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas mdxSource={CustomControlBarButtonExampleText}>
        <CustomControlBarButtonExample />
      </Canvas>

      <Heading>ControlBarButton Props</Heading>
      <Description>
        `ControlBarButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the additional
        following properties.
      </Description>
      <Props of={ControlBarButton} />
    </>
  );
};

const iconDict = {
  airplane: <Airplane20Filled key={'airplaneIconKey'} />,
  bus: <VehicleBus20Filled key={'busIconKey'} />,
  ship: <VehicleShip20Filled key={'shipIconKey'} />
};

const ControlBarButtonStory = (args): JSX.Element => {
  const icon = iconDict[args.icons];

  return <ControlBarButton {...args} onRenderIcon={() => icon} strings={{ label: args.icons }} labelKey={args.icons} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Default = ControlBarButtonStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-controlbar-buttons-base`,
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Default`,
  component: ControlBarButton,
  argTypes: {
    showLabel: { control: 'boolean', defaultValue: true, name: 'Show label' },
    icons: { control: { type: 'radio', options: ['airplane', 'bus', 'ship'] }, defaultValue: 'airplane', name: 'Icon' },
    // Hiding auto-generated controls
    labelKey: { control: false, table: { disable: true } },
    strings: { control: false, table: { disable: true } },
    onRenderOnIcon: { control: false, table: { disable: true } },
    onRenderOffIcon: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
