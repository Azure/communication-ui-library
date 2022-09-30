// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(call-readiness) */
import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useTheme, _DevicePermissionDropdownStrings, _DevicePermissionDropdown } from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import { useAdapter } from '../adapter/CallAdapterProvider';
/* @conditional-compile-remove(call-readiness) */
import { dropDownStyles } from '../styles/LocalDeviceSettings.styles';
/* @conditional-compile-remove(call-readiness) */
import { CallCompositeIcon } from '../../common/icons';

/**
 * @private
 */
export interface ConfigurationpageMicDropdownProps {
  micGrantedDropdown: JSX.Element;
  micPermissionGranted: boolean;
}

/**
 * @private
 */
export const ConfigurationpageMicDropdown = (props: ConfigurationpageMicDropdownProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const theme = useTheme();
  /* @conditional-compile-remove(call-readiness) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(call-readiness) */
  const devicePermissionDropdownStringsMicrophone: _DevicePermissionDropdownStrings = {
    placeHolderText: 'Enable Microphone (required)',
    actionButtonContent: 'Allow'
  };

  /* @conditional-compile-remove(call-readiness) */
  const microphoneBlockedDropdown = (
    <_DevicePermissionDropdown
      styles={dropDownStyles(theme)}
      onClickActionButton={async () => {
        await adapter.askDevicePermission({ video: false, audio: true });
        if (props.micPermissionGranted) {
          adapter.queryMicrophones();
          adapter.querySpeakers();
        }
      }}
      strings={devicePermissionDropdownStringsMicrophone}
      icon={<CallCompositeIcon iconName="ControlButtonMicOn" style={{ height: '1.25rem', marginRight: '0.625rem' }} />}
    />
  );

  /* @conditional-compile-remove(call-readiness) */
  return <> {props.micPermissionGranted ? props.micGrantedDropdown : microphoneBlockedDropdown}</>;
  return props.micGrantedDropdown;
};
