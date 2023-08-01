// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraSelectionMenuItemProps } from './CameraSelectionMenuItem.types';
import {
  ForwardRefComponent,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  resolveShorthand
} from '@fluentui/react-components';
import { _Announcer } from '../../Announcer/Announcer';
import { useLocale } from '../../localization';
import { Video20Filled, VideoOff20Filled } from '@fluentui/react-icons';

/**
 * Menu item designed with appropriate defaults and localization support to be used as a heading for camera functionality in a menu.
 *
 * @public
 */
export const CameraSelectionMenuItem: ForwardRefComponent<CameraSelectionMenuItemProps> = React.forwardRef(
  (props, ref) => {
    const { cameraOn, onToggleCamera, ...restOfProps } = props;

    const menuItemProps = resolveShorthand(restOfProps, {
      required: true,
      defaultProps: {
        children: cameraOn ? strings.cameraOnLabel : strings.cameraOffLabel,
        icon: cameraOn ? <Video20Filled /> : <VideoOff20Filled />,
        onClick: (ev) => onToggleCamera(ev, { cameraOn: props.cameraOn })
      }
    });

    return (
      <Menu ref={ref}>
        <MenuTrigger disableButtonEnhancement>
          <MenuItem>Logitech Brio 123</MenuItem>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Logitech Brio 123</MenuItem>
            <MenuItem>Internal camera</MenuItem>
            <MenuItem>Extenral camera</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }
);

CameraSelectionMenuItem.displayName = 'CameraSelectionMenuItem';
