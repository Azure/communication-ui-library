// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { useTheme, _TroubleshootingGuideErrorBar } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  _TroubleshootingGuideErrorBarProps,
  _TroubleshootingGuideErrorBarStrings
} from '../../../../../react-components/src/components/TroubleshootingGuideErrorBar';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';

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

  const permissionTroubleshootingGuideStrings: _TroubleshootingGuideErrorBarStrings = {
    linkText: 'Troubleshooting Camera and Microphone Permissions',
    dismissButtonText: 'OK'
  };

  const networkTroubleshootingGuideStrings: _TroubleshootingGuideErrorBarStrings = {
    linkText: 'Troubleshooting Network Connection',
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
        permissionsState={permissionsState}
        troubleshootingGuideStrings={permissionTroubleshootingGuideStrings}
      />

      <_TroubleshootingGuideErrorBar
        activeErrorMessages={args.errorTypes.map((t) => ({ type: t, timestamp: new Date(Date.now()) }))}
        onNetworkingTroubleshootingClick={onNetworkingTroubleshootingClick}
        permissionsState={permissionsState}
        troubleshootingGuideStrings={networkTroubleshootingGuideStrings}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const TroubleshootingGuideErrorBar = TroubleshootingGuideErrorBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-TroubleshootingGuideErrorBar`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/TroubleshootingGuideErrorBar`,
  component: _TroubleshootingGuideErrorBar,
  argTypes: {
    errorTypes: controlsToAdd.errorTypes,
    // Hiding auto-generated controls
    strings: hiddenControl,
    activeErrorMessages: hiddenControl,
    onPermissionsTroubleshootingClick: hiddenControl,
    camera: hiddenControl,
    microphone: hiddenControl
  }
} as Meta;
