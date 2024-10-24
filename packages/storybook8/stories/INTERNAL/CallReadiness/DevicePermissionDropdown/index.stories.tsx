// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { hiddenControl } from '../../../controlsUtils';
import { DevicePermissionDropdown } from './DevicePermissionDropdown.story';

export { DevicePermissionDropdown } from './DevicePermissionDropdown.story';

export const DevicePermissionDropdownExampleDocsOnly = {
  render: DevicePermissionDropdown
};

export default {
  title: 'Components/Internal/Call Readiness/Device Permission Dropdown',
  component: DevicePermissionDropdown,
  argTypes: {
    strings: hiddenControl,
    icon: hiddenControl,
    options: hiddenControl,
    onClickActionButton: hiddenControl,
    styles: hiddenControl
  }
} as Meta;
