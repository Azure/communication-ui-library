// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _DrawerSurface, BrowserPermissionDenied } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../../../MobileContainer';

export const BrowserPermissionDeniedDrawer: () => JSX.Element = () => {
  const locale = useLocale().strings.BrowserPermissionDenied;
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
          <_DrawerSurface disableMaxHeight={true} onLightDismiss={onLightDismissTriggered}>
            <BrowserPermissionDenied
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              onTryAgainClick={() => alert('clicked on try again button')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </>
  );
};
