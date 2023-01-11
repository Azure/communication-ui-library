// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { UnsupportedBrowser, UnsupportedBrowserVersion, UnsupportedOperatingSystem } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const UnsupportedBrowserExamples: () => JSX.Element = () => {
  return (
    <Stack horizontal>
      <Stack>
        <UnsupportedBrowser
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Stack>
      <Stack>
        <UnsupportedBrowserVersion
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
          onContinueAnywayClick={() => alert('clicked continue anyway')}
        />
      </Stack>
      <Stack>
        <UnsupportedOperatingSystem
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Stack>
    </Stack>
  );
};
