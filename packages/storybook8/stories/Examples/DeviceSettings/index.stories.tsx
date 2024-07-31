import { Meta } from '@storybook/react';
import { DeviceSettings as DeviceSettingsExample } from './DeviceSettingsDropDown.story';

export const DeviceSettings = {
  render: DeviceSettingsExample
};

export default {
  id: 'examples-devicesettings',
  title: 'Examples/Device Settings',
  component: DeviceSettingsExample,
  args: {}
} as Meta;
