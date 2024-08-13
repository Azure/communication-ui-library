// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React from 'react';
import { DeviceSettingDropdownExample } from './snippets/DeviceSettingsDropdown.snippet';

const cameraOptions = [
  'Logitech C920S HD Pro Webcam',
  'Lenovo Essential FHD Webcam',
  'Aukey PC-LM1E Full HD Webcam',
  'AVerMedia PW315',
  'Razer Kiyo'
];

const DeviceSettingsStory: () => JSX.Element = () => {
  return (
    <Stack>
      <DeviceSettingDropdownExample
        devices={cameraOptions}
        onChange={(_, option) => {
          alert(option?.text);
        }}
      />
    </Stack>
  );
};

export const DeviceSettings = DeviceSettingsStory.bind({});
