// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(call-readiness) */
import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { Icon } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useTheme, _DevicePermissionDropdownStrings, _DevicePermissionDropdown } from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import { dropDownStyles } from '../styles/LocalDeviceSettings.styles';
/* @conditional-compile-remove(call-readiness) */
import { useAdapter } from '../adapter/CallAdapterProvider';

/**
 * @private
 */
export interface ConfigurationpageCameraDropdownProps {
  cameraGrantedDropdown: JSX.Element;
  cameraPermissionGranted: boolean;
}

/**
 * @private
 */
export const ConfigurationpageCameraDropdown = (props: ConfigurationpageCameraDropdownProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const theme = useTheme();
  /* @conditional-compile-remove(call-readiness) */
  const adapter = useAdapter();

  /* @conditional-compile-remove(call-readiness) */
  const devicePermissionDropdownStringsCamera: _DevicePermissionDropdownStrings = {
    placeHolderText: 'Enable Camera (optional)',
    actionButtonContent: 'Allow'
  };
  /* @conditional-compile-remove(call-readiness) */
  const cameraBlockedDropdown = (
    <_DevicePermissionDropdown
      styles={dropDownStyles(theme)}
      onClickActionButton={async () => {
        await adapter.askDevicePermission({ video: true, audio: false });
        if (props.cameraPermissionGranted) {
          adapter.queryCameras();
        }
      }}
      strings={devicePermissionDropdownStringsCamera}
      icon={<Icon iconName="ControlButtonCameraOn" style={{ height: '1.25rem', marginRight: '0.625rem' }} />}
    />
  );

  /* @conditional-compile-remove(call-readiness) */
  return <>{props.cameraPermissionGranted ? props.cameraGrantedDropdown : cameraBlockedDropdown}</>;

  return props.cameraGrantedDropdown;
};
