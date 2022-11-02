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
import { CallingHandlers } from '@internal/calling-component-bindings';

/**
 * @private
 */
export interface ConfigurationpageMicDropdownProps {
  micGrantedDropdown: JSX.Element;
  micPermissionGranted: boolean;
  dropdownProps?: Record<string, never> & Partial<CallingHandlers>;
  callReadinessOptedIn?: boolean;
  onClickEnableDevicePermission?: () => void;
}

/**
 * @private
 */
export const ConfigurationpageMicDropdown = (props: ConfigurationpageMicDropdownProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const theme = useTheme();
  /* @conditional-compile-remove(call-readiness) */
  const devicePermissionDropdownStringsMicrophone: _DevicePermissionDropdownStrings = {
    placeHolderText: 'Enable Microphone (required)',
    actionButtonContent: 'Allow'
  };

  /* @conditional-compile-remove(call-readiness) */
  const microphoneBlockedDropdown = (
    <_DevicePermissionDropdown
      styles={dropDownStyles(theme)}
      constrain={{ video: false, audio: true }}
      strings={devicePermissionDropdownStringsMicrophone}
      icon={<CallCompositeIcon iconName="ControlButtonMicOn" style={{ height: '1.25rem', marginRight: '0.625rem' }} />}
      onClick={props.onClickEnableDevicePermission}
      {...props.dropdownProps}
    />
  );

  /* @conditional-compile-remove(call-readiness) */
  if (props.callReadinessOptedIn) {
    return <> {props.micPermissionGranted ? props.micGrantedDropdown : microphoneBlockedDropdown}</>;
  }
  return props.micGrantedDropdown;
};
