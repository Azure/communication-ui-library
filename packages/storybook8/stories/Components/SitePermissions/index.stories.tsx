// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CameraAndMicrophoneSitePermissions as CameraAndMicrophoneSitePermissionsComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { SitePermissionsCheckModal } from './snippets/SitePermissionsCheckModal.snippet';
import { SitePermissionsDeniedModal } from './snippets/SitePermissionsDeniedModal.snippet';
import { SitePermissionsExample as SitePermissionsExampleComponent } from './snippets/SitePermissionsExample.snippet';
import { SitePermissionsRequestModal } from './snippets/SitePermissionsRequestModal.snippet';

export const SitePermissionsCheckModalDocsOnly = {
  render: SitePermissionsCheckModal
};

export const SitePermissionsDeniedModalDocsOnly = {
  render: SitePermissionsDeniedModal
};

export const SitePermissionsRequestModalDocsOnly = {
  render: SitePermissionsRequestModal
};

export const SitePermissionsExampleDocsOnly = {
  render: SitePermissionsExampleComponent
};

export { SitePermissions } from './SitePermissions.story';

const meta: Meta = {
  title: 'Components/Site Permissions',
  component: CameraAndMicrophoneSitePermissionsComponent,
  argTypes: {
    siteRequest: controlsToAdd.siteDeviceRequest,
    appName: controlsToAdd.appName,
    kind: controlsToAdd.siteDeviceRequestStatus,
    // hidden controls
    onTroubleshootingClick: hiddenControl,
    onContinueAnywayClick: hiddenControl,
    cameraIconName: hiddenControl,
    microphoneIconName: hiddenControl,
    connectorIconName: hiddenControl,
    strings: hiddenControl,
    styles: hiddenControl,
    browserHint: hiddenControl
  },
  args: {
    siteRequest: 'Camera and Microphone',
    appName: 'Storybook',
    kind: 'Request'
  }
};

export default meta;
