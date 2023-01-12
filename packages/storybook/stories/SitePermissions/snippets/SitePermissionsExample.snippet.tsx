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
            type={'request'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={microphoneLocaleRequest}
            type={'request'}
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
            type={'request'}
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
            type={'denied'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={microphoneLocaleDenied}
            type={'denied'}
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
            type={'denied'}
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
            type={'check'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            strings={microphoneLocaleCheck}
            type={'check'}
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
            type={'check'}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
