// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  _DrawerSurface,
  UnsupportedBrowser,
  UnsupportedBrowserVersion,
  UnsupportedOperatingSystem
} from '@internal/react-components';
import React, { useState } from 'react';
import {} from '../../../../../react-components/src/components/UnsupportedOperatingSystem';
import { useLocale } from '../../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../../MobileContainer';

export const UnsupportedEnvironmentDrawers: () => JSX.Element = () => {
  const locale = useLocale().strings.UnsupportedBrowser;
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);
  const onLightDismissTriggered = (): void => setIsDrawerShowing(false);
  return (
    <Stack horizontal wrap>
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
            <UnsupportedBrowser
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
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
            <UnsupportedBrowserVersion
              onTroubleshootingClick={() => alert('clicked compatibility link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
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
            <UnsupportedOperatingSystem
              onTroubleshootingClick={() => alert('clicked compatibility link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </Stack>
  );
};
