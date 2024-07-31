// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  UnsupportedBrowser as UnsupportedBrowserComponent,
  UnsupportedBrowserVersion,
  UnsupportedOperatingSystem
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const UnsupportedBrowserRender = (): JSX.Element => {
  return (
    <Stack horizontal wrap>
      <Stack>
        <UnsupportedBrowserComponent
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

export const UnsupportedBrowser = UnsupportedBrowserRender.bind({});
