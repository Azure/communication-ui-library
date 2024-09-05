// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, IDropdownStyles, mergeStyles } from '@fluentui/react';
import { useTheme, _DevicePermissionDropdown } from '@internal/react-components';
import React from 'react';
import { _DevicePermissionDropdownProps, _DevicePermissionDropdownStrings } from '@internal/react-components';

const DevicePermissionDropdownStory = (): JSX.Element => {
  const theme = useTheme();

  const devicePermissionDropdownStrings: _DevicePermissionDropdownStrings = {
    label: 'Camera',
    placeHolderText: 'Enable Camera (optional)',
    actionButtonContent: 'Allow'
  };

  const styles: Partial<IDropdownStyles> = {
    root: {
      width: '300px'
    }
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
      <_DevicePermissionDropdown
        strings={devicePermissionDropdownStrings}
        icon={<Icon iconName="ControlButtonCameraOn" style={{ height: '1.25rem', marginRight: '0.625rem' }} />}
        styles={styles}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DevicePermissionDropdown = DevicePermissionDropdownStory.bind({});
