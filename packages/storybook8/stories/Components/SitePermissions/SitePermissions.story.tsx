// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraAndMicrophoneSitePermissions as CameraAndMicrophoneSitePermissionsComponent,
  CameraSitePermissions as CameraSitePermissionsComponent,
  MicrophoneSitePermissions as MicrophoneSitePermissionsComponent
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
import { ArgsFrom, controlsToAdd } from '../../controlsUtils';

const storyControls = {
  siteRequest: controlsToAdd.siteDeviceRequest,
  appName: controlsToAdd.appName,
  kind: controlsToAdd.siteDeviceRequestStatus
};

const SitePermissionsStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  return (
    <Stack>
      {args.siteRequest === controlsToAdd.siteDeviceRequest.options[0] && (
        <CameraAndMicrophoneSitePermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          kind={(args.kind as string).toLowerCase() as 'request' | 'denied' | 'check'}
        />
      )}
      {args.siteRequest === controlsToAdd.siteDeviceRequest.options[1] && (
        <CameraSitePermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          onContinueAnywayClick={() => alert('you clicked the continue anyway button')}
          kind={(args.kind as string).toLowerCase() as 'request' | 'denied' | 'check'}
        />
      )}
      {args.siteRequest === controlsToAdd.siteDeviceRequest.options[2] && (
        <MicrophoneSitePermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          kind={(args.kind as string).toLowerCase() as 'request' | 'denied' | 'check'}
        />
      )}
    </Stack>
  );
};

export const SitePermissions = SitePermissionsStory.bind({});
