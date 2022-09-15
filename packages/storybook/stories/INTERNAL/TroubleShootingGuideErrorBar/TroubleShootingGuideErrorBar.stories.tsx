// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { useTheme, _TroubleShootingGuideErrorBar } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import {
  _TroubleShootingGuideErrorBarProps,
  _TroubleShootingGuideErrorBarStrings
} from '../../../../react-components/src/components/TroubleShootingGuideErrorBar';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';

const TroubleShootingGuideErrorBarStory = (args): JSX.Element => {
  const theme = useTheme();
  const onPermissionsTroubleshootingClick = (permissionState: {
    camera: PermissionState;
    microphone: PermissionState;
  }): void => {
    console.log(permissionState);
  };

  const onNetworkingTroubleShootingClick = (): void => {
    console.log('network trouble shoot');
  };
  const permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  } = {
    camera: 'denied',
    microphone: 'denied'
  };

  const permissionTroubleShootingGuideStrings: _TroubleShootingGuideErrorBarStrings = {
    linkText: 'TroubleShooting Camera and Microphone Permissions',
    buttonText: 'OK'
  };

  const networkTroubleShootingGuideStrings: _TroubleShootingGuideErrorBarStrings = {
    linkText: 'TroubleShooting Network Connection',
    buttonText: 'OK'
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
      <_TroubleShootingGuideErrorBar
        activeErrorMessages={args.errorTypes.map((t) => ({ type: t, timestamp: new Date(Date.now()) }))}
        onPermissionsTroubleshootingClick={onPermissionsTroubleshootingClick}
        permissionsState={permissionsState}
        troubleShootingGuideStrings={permissionTroubleShootingGuideStrings}
      />

      <_TroubleShootingGuideErrorBar
        activeErrorMessages={args.errorTypes.map((t) => ({ type: t, timestamp: new Date(Date.now()) }))}
        onNetworkingTroubleShootingClick={onNetworkingTroubleShootingClick}
        permissionsState={permissionsState}
        troubleShootingGuideStrings={networkTroubleShootingGuideStrings}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const TroubleShootingGuideErrorBar = TroubleShootingGuideErrorBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-TroubleShootingGuideErrorBar`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/TroubleShootingGuideErrorBar`,
  component: _TroubleShootingGuideErrorBar,
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
