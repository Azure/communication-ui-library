// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _DrawerSurface, UnsupportedBrowser, UnsupportedBrowserVersion } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../../MobileContainer';

export const UnsupportedEnvironmentDrawers: () => JSX.Element = () => {
  const locale = useLocale().strings.UnsupportedBrowser;
  const [isDrawer1Showing, setIsDrawer1Showing] = useState(true);
  const [isDrawer2Showing, setIsDrawer2Showing] = useState(true);
  const onLightDismissTriggered1 = (): void => setIsDrawer1Showing(false);
  const onLightDismissTriggered2 = (): void => setIsDrawer2Showing(false);
  return (
    <Stack horizontal>
      <MobilePreviewContainer>
        {!isDrawer1Showing && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setIsDrawer1Showing(true)}
          >
            Click to show drawer
          </Stack>
        )}
        {isDrawer1Showing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered1}>
            <UnsupportedBrowser
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
      <MobilePreviewContainer>
        {!isDrawer2Showing && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setIsDrawer2Showing(true)}
          >
            Click to show drawer
          </Stack>
        )}
        {isDrawer2Showing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered2}>
            <UnsupportedBrowserVersion
              onTroubleshootingClick={() => alert('clicked compatibility link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </Stack>
  );
};
