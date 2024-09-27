// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Meta } from '@storybook/react';
import { DeviceSettings as DeviceSettingsStory } from './DeviceSettingsDropDown.story';

export const DeviceSettings = {
  render: DeviceSettingsStory
};

export default {
  id: 'examples-devicesettings',
  title: 'Examples/Device Settings',
  component: DeviceSettingsStory,
  args: {}
} as Meta;
