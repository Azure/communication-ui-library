// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { TroubleshootingGuideErrorBar } from './TroubleshootingGuideErrorBar.story';
export { TroubleshootingGuideErrorBar } from './TroubleshootingGuideErrorBar.story';
import { _TroubleshootingGuideErrorBar } from '@internal/react-components';
export const TroubleshootingGuideErrorBarExampleDocsOnly = {
  render: TroubleshootingGuideErrorBar
};

export default {
  title: 'Components/Internal/Call Readiness/Troubleshooting Guide Error Bar',
  component: _TroubleshootingGuideErrorBar,
  argTypes: {
    // Hiding auto-generated controls
    strings: hiddenControl,
    activeErrorMessages: hiddenControl,
    onPermissionsTroubleshootingClick: hiddenControl,
    errorTypes: controlsToAdd.errorTypes,
    ignorePremountErrors: hiddenControl,
    onDismissError: hiddenControl
  },
  args: {
    errorTypes: ['accessDenied']
  }
} as Meta;
