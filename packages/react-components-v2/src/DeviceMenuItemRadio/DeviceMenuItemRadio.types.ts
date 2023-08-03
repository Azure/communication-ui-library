// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MenuItemRadioProps } from '@fluentui/react-components';

/**
 * Details of a device such as a camera, microphone or speaker.
 *
 * @public
 */
export interface DeviceDefinition {
  id: string;
  name: string;
}

/**
 * Template render function for the {@link DeviceMenuItemRadio} component.
 *
 * @public
 */
export type DeviceMenuItemRadioRenderFunctionProps = Partial<MenuItemRadioProps>;

/**
 * Template render function for the {@link DeviceMenuItemRadio} component.
 *
 * @public
 */
export type DeviceMenuItemRadioRenderFunction = (state: DeviceMenuItemRadioRenderState) => React.ReactNode;

/**
 * Props for the {@link DeviceMenuItemRadio} component.
 *
 * @public
 */
export type DeviceMenuItemRadioProps = {
  children?: DeviceMenuItemRadioRenderFunction;
};

/**
 * State used in rendering the {@link DeviceMenuItemRadio} component.
 *
 * @public
 */
export type DeviceMenuItemRadioRenderState = {
  device: DeviceDefinition;
  renderDeviceMenuItemRadio: (props?: DeviceMenuItemRadioRenderFunctionProps) => React.ReactNode;
};
