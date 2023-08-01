// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraSelectionMenuGroupProps } from './CameraSelectionMenuGroup.types';
import {
  ForwardRefComponent,
  Menu,
  MenuGroupHeader,
  MenuItem,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  resolveShorthand
} from '@fluentui/react-components';
import { _Announcer } from '../../Announcer/Announcer';
import { useLocale } from '../../localization';
import { Video16Regular } from '@fluentui/react-icons';

/**
 * TODO: redo docs
 * Menu item designed with appropriate defaults and localization support to be used as a heading for the camera button menu.
 *
 * @public
 */
export const CameraSelectionMenuGroup: ForwardRefComponent<CameraSelectionMenuGroupProps> = React.forwardRef(
  (props, ref) => {
    const { menuGroupHeader, selectedCamera, availableCameras, onSelectCamera, ...restOfProps } = props;

    const strings = useLocale().strings.cameraSelectionMenuGroup;

    const menuGroupHeaderProps = resolveShorthand(menuGroupHeader, {
      required: true,
      defaultProps: {
        children: strings.label
      }
    });

    const menuItemRender = (itemProps: DeviceMenuItemProps, index: number): React.ReactNode => {
      return (
        props.children?.({ ...itemProps }) ?? (
          <MenuItemRadio
            key={index}
            icon={<Video16Regular />}
            onClick={(ev) => itemProps.onDeviceSelected(ev, itemProps.device)}
            name={itemProps.device.name}
            value={itemProps.device.id}
          >
            {itemProps.device.name}
          </MenuItemRadio>
        )
      );
    };

    return (
      <div {...restOfProps} ref={ref}>
        <MenuGroupHeader {...menuGroupHeaderProps} />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuItem>{selectedCamera.name}</MenuItem>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {availableCameras.map((camera, index) =>
                menuItemRender({ device: camera, onDeviceSelected: onSelectCamera }, index)
              )}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    );
  }
);

CameraSelectionMenuGroup.displayName = 'CameraSelectionMenuGroup';
