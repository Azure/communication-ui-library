// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { RTTModal } from '@internal/react-components';
import React from 'react';

export const RTTModalStory = (args: any): JSX.Element => {
  return (
    <Stack>
      <RTTModal
        showModal={true}
        onDismissModal={() => {
          console.log('dismissed');
        }}
        onStartRTT={() => {
          console.log('RTT started');
          return Promise.resolve();
        }}
      />{' '}
    </Stack>
  );
};
