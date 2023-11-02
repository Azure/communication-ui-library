// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CameraAndMicrophoneSitePermissions,
  CameraSitePermissions,
  DEFAULT_COMPONENT_ICONS,
  MicrophoneSitePermissions
} from '@azure/communication-react';
import { Stack, registerIcons } from '@fluentui/react';
import React from 'react';

registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});

export const SitePermissionsExample: () => JSX.Element = () => {
  return (
    <Stack>
      <Stack horizontal>
        <Stack>
          <CameraAndMicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onPrimaryButtonClick={() => {
              alert('allow clicked');
            }}
            kind={'request'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onPrimaryButtonClick={() => {
              alert('allow clicked');
            }}
            kind={'request'}
          />
        </Stack>
        <Stack>
          <CameraSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onPrimaryButtonClick={() => {
              alert('allow clicked');
            }}
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
            kind={'denied'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            kind={'denied'}
          />
        </Stack>
        <Stack>
          <CameraSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onPrimaryButtonClick={() => {
              alert('clicked continue anyway');
            }}
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
            kind={'check'}
          />
        </Stack>
        <Stack>
          <MicrophoneSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            kind={'check'}
          />
        </Stack>
        <Stack>
          <CameraSitePermissions
            appName={'Storybook'}
            onTroubleshootingClick={() => {
              alert('clicked trouble shooting');
            }}
            onPrimaryButtonClick={() => {
              alert('clicked continue anyway');
            }}
            kind={'check'}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
