// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _DrawerSurface, CameraAndMicrophoneSitePermissions } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../../../MobileContainer';

export const BrowserPemissionDeniedAndroidDrawer: () => JSX.Element = () => {
  const locale = useLocale().strings.CameraAndMicrophoneSitePermissionsRequest;
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
            <CameraAndMicrophoneSitePermissions
              appName={'Contoso app'}
              onTroubleshootingClick={() => alert('clicked troubleshooting link')}
              onContinueAnywayClick={() => alert('clicked Allow Access button')}
              strings={locale}
              kind={'request'}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </>
  );
};
