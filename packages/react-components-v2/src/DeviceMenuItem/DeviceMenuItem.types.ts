// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentProps, MenuItemProps } from '@fluentui/react-components';

/** @public TODO: docs */
export interface DeviceDefinition {
  id: string;
  name: string;
}

/** @public TODO: docs */
export type DeviceMenuItemRenderFunction = (props: DeviceDefinition) => React.ReactNode;

/** @public TODO: docs */
export type DeviceMenuItemProps = Omit<MenuItemProps, 'children'> & {
  device: DeviceDefinition;
  onDeviceSelected: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, device: DeviceDefinition) => void;
  children: DeviceMenuItemRenderFunction;
};
