// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { UnsupportedBrowser as UnsupportedBrowserComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';
import { UnsupportedBrowserExamples } from './snippets/UnsupportedBrowserExamples.snippet';
import { UnsupportedEnvironmentModals } from './snippets/UnsupportedEnvironmentModal.snippet';

export const UnsupportedBrowserExamplesDocsOnly = {
  render: UnsupportedBrowserExamples
};

export const UnsupportedEnvironmentModalsDocsOnly = {
  render: UnsupportedEnvironmentModals
};

const meta: Meta = {
  title: 'Components/Unsupported Browser',
  component: UnsupportedBrowserComponent,
  argTypes: {
    // hidden controls
    onTroubleshootingClick: hiddenControl,
    strings: hiddenControl
  }
} as Meta<typeof UnsupportedBrowserComponent>;

export default meta;
