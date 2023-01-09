// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  _DrawerSurface,
  CameraAndMicrophoneSitePermissions,
  MicrophoneSitePermissions,
  CameraSitePermissions
} from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../MobileContainer';

export const SitePermissionsDeniedDrawer: () => JSX.Element = () => {
  const [microphoneCameraDrawerOpen, setMicrophoneCameraDrawerOpen] = useState<boolean>(false);
  const [microphoneDrawerOpen, setMicrophoneDrawerOpen] = useState<boolean>(false);
  const [cameraDrawerOpen, setCameraDrawerOpen] = useState<boolean>(false);
  const micCameralocale = useLocale().strings.CameraAndMicrophoneSitePermissionsDenied;
  const cameraLocale = useLocale().strings.CameraSitePermissionsDenied;
  const microphoneLocale = useLocale().strings.MicrophoneSitePermissionsDenied;
  return (
    <Stack horizontal wrap>
      <MobilePreviewContainer>
        {!microphoneCameraDrawerOpen && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setMicrophoneCameraDrawerOpen(true)}
          >
            Click to show camera and mic drawer
          </Stack>
        )}
        {microphoneCameraDrawerOpen && (
          <_DrawerSurface onLightDismiss={() => setMicrophoneCameraDrawerOpen(false)}>
            <CameraAndMicrophoneSitePermissions
              appName={'Storybook'}
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              strings={micCameralocale}
              type={'denied'}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>

      <MobilePreviewContainer>
        {!microphoneDrawerOpen && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setMicrophoneDrawerOpen(true)}
          >
            Click to show microphone drawer
          </Stack>
        )}
        {microphoneDrawerOpen && (
          <_DrawerSurface onLightDismiss={() => setMicrophoneDrawerOpen(false)}>
            <MicrophoneSitePermissions
              appName={'Storybook'}
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              strings={microphoneLocale}
              type={'denied'}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>

      <MobilePreviewContainer>
        {!cameraDrawerOpen && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setCameraDrawerOpen(true)}
          >
            Click to show camera drawer
          </Stack>
        )}
        {cameraDrawerOpen && (
          <_DrawerSurface onLightDismiss={() => setCameraDrawerOpen(false)}>
            <CameraSitePermissions
              appName={'Storybook'}
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              onContinueAnywayClick={() => {
                setCameraDrawerOpen(false);
              }}
              strings={cameraLocale}
              type={'denied'}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </Stack>
  );
};
