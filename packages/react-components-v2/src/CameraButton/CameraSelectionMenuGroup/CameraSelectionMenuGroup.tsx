// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraSelectionMenuGroupProps } from './CameraSelectionMenuGroup.types';
import {
  ForwardRefComponent,
  Menu,
  MenuGroupHeader,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  resolveShorthand
} from '@fluentui/react-components';
import { _Announcer } from '../../Announcer/Announcer';
import { useLocale } from '../../localization';
import { Video16Regular } from '@fluentui/react-icons';
import { DeviceMenuItemRadio } from '../../DeviceMenuItemRadio';
import { DeviceMenuGroupContextProvider } from '../../DeviceMenuItemRadio/DeviceMenuGroupContext';
import { DeviceMenuItemRadioContextProvider } from '../../DeviceMenuItemRadio/DeviceMenuItemRadioContext';

/**
 * Menu section that contains a Camera heading that has localization support and menu item allowing
 * the user to select a camera from a list of available cameras.
 *
 * @public
 */
export const CameraSelectionMenuGroup: ForwardRefComponent<CameraSelectionMenuGroupProps> = React.forwardRef(
  (props, ref) => {
    const { menuGroupHeader, selectedCamera, availableCameras, onSelectCamera, children, ...restOfProps } = props;

    const strings = useLocale().strings.cameraSelectionMenuGroup;

    const menuGroupHeaderProps = resolveShorthand(menuGroupHeader, {
      required: true,
      defaultProps: {
        children: strings.label
      }
    });

    const icon = <Video16Regular />;

    return (
      <div {...restOfProps} ref={ref}>
        <MenuGroupHeader {...menuGroupHeaderProps} />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuItem>{selectedCamera.name}</MenuItem>
          </MenuTrigger>
          <MenuPopover>
            <MenuList checkedValues={{ camera: [selectedCamera.id] }}>
              <DeviceMenuGroupContextProvider
                value={{
                  selectedDeviceId: selectedCamera.id,
                  radioGroupName: 'camera',
                  onDeviceSelected: onSelectCamera
                }}
              >
                {availableCameras.map((camera, index) => (
                  <DeviceMenuItemRadioContextProvider
                    key={index}
                    value={{
                      device: camera
                    }}
                  >
                    {children ?? (
                      <DeviceMenuItemRadio>
                        {({ renderDeviceMenuItemRadio }) => renderDeviceMenuItemRadio({ icon })}
                      </DeviceMenuItemRadio>
                    )}
                  </DeviceMenuItemRadioContextProvider>
                ))}
              </DeviceMenuGroupContextProvider>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    );
  }
);

CameraSelectionMenuGroup.displayName = 'CameraSelectionMenuGroup';
