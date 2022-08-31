// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _DomainPermissions, _DrawerSurface } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { MobilePreviewContainer } from '../../../MobileContainer';

export const DomainPermissionsDrawerStory = (): JSX.Element => {
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);
  const onLightDismissTriggered = (): void => setIsDrawerShowing(false);
  return (
    <MobilePreviewContainer>
      {!isDrawerShowing && (
        <Stack
          styles={{ root: { cursor: 'pointer' } }}
          verticalFill
          verticalAlign="center"
          horizontalAlign="center"
          onClick={() => setIsDrawerShowing(true)}
        >
          Click to show drawer
        </Stack>
      )}
      {isDrawerShowing && (
        <_DrawerSurface onLightDismiss={onLightDismissTriggered}>
          <_DomainPermissions
            appName={'Contoso app'}
            onGetTroubleShooting={() => alert('clicked trouble shooting link')}
          />
        </_DrawerSurface>
      )}
    </MobilePreviewContainer>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DomainPermissionsDrawer = DomainPermissionsDrawerStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-domain-permissions-drawer`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/DomainPermissions/Domain Permissions Drawer`,
  component: DomainPermissionsDrawer
} as Meta;
