// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
import React from 'react';
import {
  _TroubleshootingGuideErrorBarProps,
  _TroubleshootingGuideErrorBarStrings,
  _TroubleshootingGuideErrorBar,
  useTheme
} from '@internal/react-components';

const TroubleshootingGuideErrorBarStory = (args): JSX.Element => {
  const theme = useTheme();
  const onPermissionsTroubleshootingClick = (permissionState: {
    camera: PermissionState;
    microphone: PermissionState;
  }): void => {
    console.log(permissionState);
  };

  const onNetworkingTroubleshootingClick = (): void => {
    console.log('network trouble shoot');
  };
  const permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  } = {
    camera: 'denied',
    microphone: 'granted'
  };

  const troubleshootingGuideStrings: _TroubleshootingGuideErrorBarStrings = {
    devicePermissionLinkText: 'Troubleshooting Camera and Microphone Permissions',
    networkTroubleshootingLinkText: 'Troubleshooting Network Connection',
    dismissButtonText: 'OK'
  };

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '50%'
      })}
    >
      <_TroubleshootingGuideErrorBar
        activeErrorMessages={args.errorTypes.map((t) => ({ type: t, timestamp: new Date(Date.now()) }))}
        onPermissionsTroubleshootingClick={onPermissionsTroubleshootingClick}
        onNetworkingTroubleshootingClick={onNetworkingTroubleshootingClick}
        permissionsState={permissionsState}
        troubleshootingGuideStrings={troubleshootingGuideStrings}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const TroubleshootingGuideErrorBar = TroubleshootingGuideErrorBarStory.bind({});
