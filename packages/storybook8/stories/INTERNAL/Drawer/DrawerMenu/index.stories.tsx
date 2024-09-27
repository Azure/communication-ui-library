// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _DrawerMenu as DrawerMenuComponent } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../../controlsUtils';
import { DrawerMenu } from './DrawerMenu.story';
export { DrawerMenu } from './DrawerMenu.story';

export const DrawerMenuDocsOnly = {
  render: DrawerMenu
};

export default {
  title: 'Components/Internal/Drawer/Drawer Menu',
  component: DrawerMenuComponent,
  argTypes: {
    onLightDismiss: hiddenControl,
    styles: hiddenControl,
    items: hiddenControl
  }
} as Meta;
