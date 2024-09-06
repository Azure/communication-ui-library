// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import {
  BrowserPermissionDenied as BrowserPermissionDeniedComponent,
  _DrawerSurface
} from '@internal/react-components';
import React from 'react';
import { useLocale } from '../../../../../react-components/src/localization';

const BrowserPermissionDeniedStory = (): JSX.Element => {
  const locale = useLocale().strings.BrowserPermissionDenied;
  return (
    <Stack>
      <BrowserPermissionDeniedComponent
        onTroubleshootingClick={function (): void {
          alert('you clicked the help text');
        }}
        onTryAgainClick={() => {
          alert('you clicked the try again button');
        }}
        strings={locale}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const BrowserPermissionDenied = BrowserPermissionDeniedStory.bind({});
