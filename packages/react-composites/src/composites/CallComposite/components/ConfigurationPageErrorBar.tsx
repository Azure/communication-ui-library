// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import {
  _DevicePermissionDropdownStrings,
  _DevicePermissionDropdown,
  _DevicePermissionDropdownProps,
  ActiveErrorMessage,
  ErrorBarProps,
  _TroubleshootingGuideErrorBarStrings,
  _TroubleshootingGuideErrorBar,
  ErrorBar
} from '@internal/react-components';
import { CallingHandlers } from '@internal/calling-component-bindings';
import { Common } from '@internal/acs-ui-common';

/**
 * @private
 */
export interface ConfigurationPageErrorBarProps {
  errorBarProps: {
    activeErrorMessages: ActiveErrorMessage[];
  } & Common<CallingHandlers, ErrorBarProps>;
  showTroubleShootingErrorBar?: boolean;
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  onNetworkingTroubleShootingClick?: () => void;
  permissionsState?: {
    camera: PermissionState;
    microphone: PermissionState;
  };
}

/**
 * @private
 */
export const ConfigurationPageErrorBar = (props: ConfigurationPageErrorBarProps): JSX.Element => {
  const {
    errorBarProps,
    /* @conditional-compile-remove(call-readiness) */
    showTroubleShootingErrorBar = false,
    /* @conditional-compile-remove(call-readiness) */
    onPermissionsTroubleshootingClick,
    /* @conditional-compile-remove(call-readiness) */
    onNetworkingTroubleShootingClick,
    /* @conditional-compile-remove(call-readiness) */
    permissionsState
  } = props;

  /* @conditional-compile-remove(call-readiness) */
  const permissionTroubleshootingGuideStrings: _TroubleshootingGuideErrorBarStrings = {
    devicePermissionLinkText: 'Troubleshooting Camera and Microphone Permissions',
    networkTroubleshootingLinkText: 'Troubleshooting Network Connection',
    dismissButtonText: 'OK'
  };

  /* @conditional-compile-remove(call-readiness) */
  if (showTroubleShootingErrorBar) {
    return (
      <_TroubleshootingGuideErrorBar
        troubleshootingGuideStrings={permissionTroubleshootingGuideStrings}
        onPermissionsTroubleshootingClick={onPermissionsTroubleshootingClick}
        onNetworkingTroubleshootingClick={onNetworkingTroubleShootingClick}
        permissionsState={permissionsState}
        {...errorBarProps}
      />
    );
  }

  return <ErrorBar {...errorBarProps} />;
};
