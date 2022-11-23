// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _DrawerSurface, UnsupportedBrowserVersion } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../../MobileContainer';

export const UnsupportedBrowserVersionDrawer: () => JSX.Element = () => {
  const locale = useLocale().strings.UnsupportedBrowser;
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);
  const onLightDismissTriggered = (): void => setIsDrawerShowing(false);
  return (
    <>
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
              onTroubleshootingClick={() => alert('clicked compatibility checking link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </>
  );
};
