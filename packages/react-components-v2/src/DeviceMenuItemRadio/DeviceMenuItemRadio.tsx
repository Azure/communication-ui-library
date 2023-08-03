// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MenuItemRadio } from '@fluentui/react-components';
import { DeviceMenuItemRadioProps, DeviceMenuItemRadioRenderFunctionProps } from './DeviceMenuItemRadio.types';
import { useDeviceMenuGroupContext } from './DeviceMenuGroupContext';
import { useDeviceMenuItemRadioContext } from './DeviceMenuItemRadioContext';

/**
 * DeviceMenuItem component.
 *
 * @public
 */
export const DeviceMenuItemRadio: React.FC<DeviceMenuItemRadioProps> = (props) => {
  const device = useDeviceMenuItemRadioContext((ctx) => ctx.device);
  const icon = useDeviceMenuItemRadioContext((ctx) => ctx.icon);
  const onDeviceSelected = useDeviceMenuGroupContext((ctx) => ctx.onDeviceSelected);
  const groupName = useDeviceMenuGroupContext((ctx) => ctx.radioGroupName);

  const defaultProps = {
    onDeviceSelected,
    name: groupName,
    value: device.id,
    onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => onDeviceSelected(ev, device),
    children: device.name,
    icon: icon
  };

  const renderFunction = (props?: DeviceMenuItemRadioRenderFunctionProps): React.ReactNode => (
    <MenuItemRadio {...defaultProps} {...(props || {})} />
  );

  return <>{props.children?.({ device, renderDeviceMenuItemRadio: renderFunction }) ?? renderFunction()}</>;
};

DeviceMenuItemRadio.displayName = 'DeviceMenuItemRadio';
