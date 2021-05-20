// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Heading, Description, Canvas } from '@storybook/addon-docs/blocks';
import { array } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { DeviceSettingDropdownExample } from './snippets/DeviceSettingsDropdown.snippet';

const DevicesDropdownExampleText = require('!!raw-loader!./snippets/DeviceSettingsDropdown.snippet.tsx').default;

const label = 'Cameras';

const defaultValue = [
  'Logitech C920S HD Pro Webcam',
  'Lenovo Essential FHD Webcam',
  'Aukey PC-LM1E Full HD Webcam',
  'AVerMedia PW315',
  'Razer Kiyo'
];

const cameras = array(label, defaultValue);

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Device Setting</Title>

      <Heading>Create a dropdown of cameras to select</Heading>
      <Description>
        To build a UI component for device settings, we recommend using the Fluent UI
        [Dropdown](https://developer.microsoft.com/en-us/fluentui#/controls/web/dropdown). Using the retrieved devices
        from the calling sdk, apply the devices as options in the dropdown. When a user selects an element from the
        dropdown, use the `onChange` callback to save the result. For this case we are just going to use an array of
        placeholder cameras (strings) and we are going to demonstrate how to use a FluentUI `Dropdown` to create a list
        of devices for a user to select.
      </Description>
      <Canvas mdxSource={DevicesDropdownExampleText}>
        <DeviceSettingDropdownExample
          devices={cameras}
          onChange={(_, option) => {
            alert(option?.text);
          }}
        />
      </Canvas>
    </>
  );
};
export const DeviceSettings: () => JSX.Element = () => {
  return (
    <DeviceSettingDropdownExample
      devices={cameras}
      onChange={(_, option) => {
        alert(option?.text);
      }}
    />
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Device Settings`,
  component: DeviceSettings,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
