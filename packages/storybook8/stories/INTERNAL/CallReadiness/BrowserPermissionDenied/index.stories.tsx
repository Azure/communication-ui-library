// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { BrowserPemissionDeniedAndroidDrawer } from './snippets/BrowserPermissionDeniedAndroidDrawer.snippet';
import { BrowserPermissionDeniedDrawer } from './snippets/BrowserPermissionDeniedDrawer.snippet';
import { BrowserPermissionDeniedIOSDrawer } from './snippets/BrowserPermissionDeniedIOSDrawer.snippet';
import { BrowserPermissionDeniedModal } from './snippets/BrowserPermissionDeniedModal.snippet';

export { BrowserPermissionDenied } from './BrowserPermissionDenied.story';

export const BrowserPemissionDeniedAndroidDrawerExampleDocsOnly = {
  render: BrowserPemissionDeniedAndroidDrawer
};

export const BrowserPermissionDeniedDrawerExampleDocsOnly = {
  render: BrowserPermissionDeniedDrawer
};

export const BrowserPermissionDeniedIOSDrawerExampleDocsOnly = {
  render: BrowserPermissionDeniedIOSDrawer
};

export const BrowserPermissionDeniedModalExampleDocsOnly = {
  render: BrowserPermissionDeniedModal
};
const meta: Meta = {
  title: 'Components/Internal/Call Readiness/Browser Permission Denied',
  component: BrowserPermissionDeniedModal,
  argTypes: {},
  args: {}
};

export default meta;
