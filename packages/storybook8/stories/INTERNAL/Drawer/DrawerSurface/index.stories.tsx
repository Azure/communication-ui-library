// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { _DrawerSurface as DrawerSurfaceComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/*';
import { hiddenControl } from '../../../controlsUtils';
import { DrawerSurface } from './DrawerSurface.story';
export { DrawerSurface } from './DrawerSurface.story';

export const DrawerSurfaceDocsOnly = {
  render: DrawerSurface
};

export default {
  title: 'Components/Internal/Drawer/Drawer Surface',
  component: DrawerSurfaceComponent,
  argTypes: {
    children: hiddenControl,
    onLightDismiss: hiddenControl,
    styles: hiddenControl
  }
} as Meta;
