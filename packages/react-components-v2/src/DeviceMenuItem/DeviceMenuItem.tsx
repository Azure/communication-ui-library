// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ForwardRefComponent, MenuItem } from '@fluentui/react-components';
import { DeviceMenuItemProps } from './DeviceMenuItem.types';
import { Video16Regular } from '@fluentui/react-icons';

/**
 * TODO: docs
 *
 * @public
 */
export const DeviceMenuItem: ForwardRefComponent<DeviceMenuItemProps> = React.forwardRef((props, ref) => {
  const { device, onDeviceSelected, children, ...restOfProps } = props;

  return (
    children?.(device) ?? (
      <MenuItem icon={<Video16Regular />} onClick={(ev) => onDeviceSelected(ev, device)} {...restOfProps} ref={ref}>
        {device.name}
      </MenuItem>
    )
  );
});
