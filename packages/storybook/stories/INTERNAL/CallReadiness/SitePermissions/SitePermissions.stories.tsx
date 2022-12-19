// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  CameraAndMicrophoneSitePermissions as CameraAndMicrophoneSitePermissionsComponent,
  CameraSitePermissions as CameraSitePermissionsComponent,
  MicrophoneSitePermissions as MicrophoneSitePermissionsComponent,
  _DrawerSurface
} from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { ArgsFrom, controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { SitePermissionsDrawer } from './snippets/SitePermissionsDrawer.snippet';
import { SitePermissionsModal } from './snippets/SitePermissionsModal.snippet';

const SitePermissionsDrawerExample = require('!!raw-loader!./snippets/SitePermissionsDrawer.snippet.tsx').default;
const SitePermissionsModalExample = require('!!raw-loader!./snippets/SitePermissionsModal.snippet.tsx').default;

const storyControls = {
  siteRequest: controlsToAdd.siteDeviceRequest,
  appName: controlsToAdd.appName,
  type: controlsToAdd.siteDeviceRequestStatus
};

const SitePermissionsStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  return (
    <Stack>
      {args.siteRequest === controlsToAdd.siteDeviceRequest.options[0] && (
        <CameraAndMicrophoneSitePermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          type={(args.type as string).toLowerCase() as 'request' | 'denied' | 'check'}
        />
      )}
      {args.siteRequest === controlsToAdd.siteDeviceRequest.options[1] && (
        <CameraSitePermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          onContinueAnywayClick={() => alert('you clicked the continue anyway button')}
          type={(args.type as string).toLowerCase() as 'request' | 'denied' | 'check'}
        />
      )}
      {args.siteRequest === controlsToAdd.siteDeviceRequest.options[2] && (
        <MicrophoneSitePermissionsComponent
          appName={args.appName}
          onTroubleshootingClick={() => alert('you clicked the help text')}
          type={(args.type as string).toLowerCase() as 'request' | 'denied' | 'check'}
        />
      )}
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <Stack>
      <SingleLineBetaBanner />
      <Title>Site Permissions</Title>
      <Description>
        Component to display information to the end user when their device permissions are not set appropriately
      </Description>
      <Heading>Using in a modal</Heading>
      <Description>
        you are able to hide the SitePermissions component in a Modal to show the help tile over your applications user
        interface.
      </Description>
      <Canvas mdxSource={SitePermissionsModalExample}>
        <SitePermissionsModal />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Canvas mdxSource={SitePermissionsDrawerExample}>
        <SitePermissionsDrawer />
      </Canvas>
      <Props of={CameraAndMicrophoneSitePermissionsComponent} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const SitePermissions = SitePermissionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-site-permissions`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Site Permissions`,
  component: CameraAndMicrophoneSitePermissionsComponent,
  argTypes: {
    ...storyControls,

    // hidden controls
    onTroubleshootingClick: hiddenControl,
    onContinueAnywayClick: hiddenControl,
    cameraIconName: hiddenControl,
    microphoneIconName: hiddenControl,
    connectorIconName: hiddenControl,
    strings: hiddenControl,
    styles: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
