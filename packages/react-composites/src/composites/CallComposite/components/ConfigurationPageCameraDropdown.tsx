// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(call-readiness) */
import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import {
  useTheme,
  _DevicePermissionDropdownStrings,
  _DevicePermissionDropdown,
  _DevicePermissionDropdownProps
} from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import { dropDownStyles } from '../styles/LocalDeviceSettings.styles';
/* @conditional-compile-remove(call-readiness) */
import { CallCompositeIcon } from '../../common/icons';

/**
 * @private
 */
export interface ConfigurationPageCameraDropdownProps {
  cameraGrantedDropdown: JSX.Element;
  cameraPermissionGranted: boolean;
  /* @conditional-compile-remove(call-readiness) */
  dropdownProps: Partial<_DevicePermissionDropdownProps>;
  onClickEnableDevicePermission?: () => void;
}

/**
 * @private
 */
export const ConfigurationPageCameraDropdown = (props: ConfigurationPageCameraDropdownProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const theme = useTheme();

  /* @conditional-compile-remove(call-readiness) */
  const devicePermissionDropdownStringsCamera: _DevicePermissionDropdownStrings = {
    placeHolderText: 'Enable Camera (optional)',
    actionButtonContent: 'Allow'
  };
  /* @conditional-compile-remove(call-readiness) */
  const cameraBlockedDropdown = (
    <_DevicePermissionDropdown
      {...props.dropdownProps}
      styles={dropDownStyles(theme)}
      constrain={{ video: true, audio: false }}
      strings={devicePermissionDropdownStringsCamera}
      icon={
        <CallCompositeIcon iconName="ControlButtonCameraOn" style={{ height: '1.25rem', marginRight: '0.625rem' }} />
      }
      onClick={props.onClickEnableDevicePermission}
    />
  );

  /* @conditional-compile-remove(call-readiness) */
  return props.cameraPermissionGranted ? props.cameraGrantedDropdown : cameraBlockedDropdown;

  return props.cameraGrantedDropdown;
};
