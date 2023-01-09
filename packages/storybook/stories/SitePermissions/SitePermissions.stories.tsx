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
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { ArgsFrom, controlsToAdd, hiddenControl } from '../controlsUtils';
import { SitePermissionsCheckDrawer } from './snippets/SitePermissionsCheckDrawer.snippet';
import { SitePermissionsCheckModal } from './snippets/SitePermissionsCheckModal.snippet';
import { SitePermissionsDeniedDrawer } from './snippets/SitePermissionsDeniedDrawer.snippet';
import { SitePermissionsDeniedModal } from './snippets/SitePermissionsDeniedModal.snippet';
import { SitePermissionsRequestDrawer } from './snippets/SitePermissionsRequestDrawer.snippet';
import { SitePermissionsRequestModal } from './snippets/SitePermissionsRequestModal.snippet';

const SitePermissionsRequestModalExample =
  require('!!raw-loader!./snippets/SitePermissionsRequestModal.snippet.tsx').default;
const SitePermissionsCheckModalExample =
  require('!!raw-loader!./snippets/SitePermissionsCheckModal.snippet.tsx').default;
const SitePermissionsDeniedModalExample =
  require('!!raw-loader!./snippets/SitePermissionsDeniedModal.snippet.tsx').default;

const SitePermissionsRequestDrawerExample =
  require('!!raw-loader!./snippets/SitePermissionsRequestDrawer.snippet.tsx').default;
const SitePermissionsCheckDrawerExample =
  require('!!raw-loader!./snippets/SitePermissionsCheckDrawer.snippet.tsx').default;
const SitePermissionsDeniedDrawerExample =
  require('!!raw-loader!./snippets/SitePermissionsDeniedDrawer.snippet.tsx').default;

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
      <Heading>Request site permissions in a modal</Heading>
      <Description>You can request for site permissions using a pop up modal</Description>
      <Canvas mdxSource={SitePermissionsRequestModalExample}>
        <SitePermissionsRequestModal />
      </Canvas>
      <Heading>Checking for site permissions in a modal</Heading>
      <Description>
        You can show the end users that you are checking for site permissions using a pop up modal
      </Description>
      <Canvas mdxSource={SitePermissionsCheckModalExample}>
        <SitePermissionsCheckModal />
      </Canvas>
      <Heading>Site permissions denied in a modal</Heading>
      <Description>You can show the end users that site permissions are denied using a pop up modal</Description>
      <Canvas mdxSource={SitePermissionsDeniedModalExample}>
        <SitePermissionsDeniedModal />
      </Canvas>

      <Heading>Request site permissions on mobile</Heading>
      <Description>You can request for site permissions using a pop up drawer on mobile</Description>
      <Canvas mdxSource={SitePermissionsRequestDrawerExample}>
        <SitePermissionsRequestDrawer />
      </Canvas>
      <Heading>Checking for site permissions on mobile</Heading>
      <Description>
        You can show the end users that you are checking for site permissions using a pop up drawer on mobile
      </Description>
      <Canvas mdxSource={SitePermissionsCheckDrawerExample}>
        <SitePermissionsCheckDrawer />
      </Canvas>
      <Heading>Site permissions denied on mobile</Heading>
      <Description>
        You can show the end users that site permissions are denied using a pop up drawer on mobile
      </Description>
      <Canvas mdxSource={SitePermissionsDeniedDrawerExample}>
        <SitePermissionsDeniedDrawer />
      </Canvas>
      <Props of={CameraAndMicrophoneSitePermissionsComponent} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const SitePermissions = SitePermissionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-site-permissions`,
  title: `${COMPONENT_FOLDER_PREFIX}/Site Permissions`,
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
