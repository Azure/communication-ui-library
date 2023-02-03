// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CameraAndMicrophoneSitePermissions,
  CameraSitePermissions,
  MicrophoneSitePermissions
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../../../react-components/src/localization';

export const SitePermissionsExample: () => JSX.Element = () => {
  const micCameralocaleRequest = useLocale().strings.CameraAndMicrophoneSitePermissionsRequest;
  const cameraLocaleRequest = useLocale().strings.CameraSitePermissionsRequest;
  const microphoneLocaleRequest = useLocale().strings.MicrophoneSitePermissionsRequest;

  const micCameralocaleCheck = useLocale().strings.CameraAndMicrophoneSitePermissionsCheck;
  const cameraLocaleCheck = useLocale().strings.CameraSitePermissionsCheck;
  const microphoneLocaleCheck = useLocale().strings.MicrophoneSitePermissionsCheck;

  const micCameralocaleDenied = useLocale().strings.CameraAndMicrophoneSitePermissionsDenied;
  const cameraLocaleDenied = useLocale().strings.CameraSitePermissionsDenied;
  const microphoneLocaleDenied = useLocale().strings.MicrophoneSitePermissionsDenied;

  return (
    <Stack>
      <Stack horizontal>
        <Stack>
          <CameraAndMicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={micCameralocaleRequest}
            kind={'request'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={microphoneLocaleRequest}
            kind={'request'}
          />
        </Stack>
        <Stack>
          <CameraSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onContinueAnywayClick={() => {
              alert('clicked continuec anyway');
            }}
            strings={cameraLocaleRequest}
            kind={'request'}
          />
        </Stack>
      </Stack>
      <Stack horizontal>
        <Stack>
          <CameraAndMicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={micCameralocaleDenied}
            kind={'denied'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={microphoneLocaleDenied}
            kind={'denied'}
          />
        </Stack>
        <Stack>
          <CameraSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onContinueAnywayClick={() => {
              alert('clicked continuec anyway');
            }}
            strings={cameraLocaleDenied}
            kind={'denied'}
          />
        </Stack>
      </Stack>
      <Stack horizontal>
        <Stack>
          <CameraAndMicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={micCameralocaleCheck}
            kind={'check'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={microphoneLocaleCheck}
            kind={'check'}
          />
        </Stack>
        <Stack>
          <CameraSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onContinueAnywayClick={() => {
              alert('clicked continuec anyway');
            }}
            strings={cameraLocaleCheck}
            kind={'check'}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
