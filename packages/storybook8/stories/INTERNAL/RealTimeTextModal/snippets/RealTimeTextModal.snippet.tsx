// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { RealTimeTextModal } from '@internal/react-components';
import React from 'react';

export const RealTimeTextModalStory = (): JSX.Element => {
  return (
    <Stack>
      <RealTimeTextModal
        showModal={true}
        onDismissModal={() => {
          alert('Real Time Text Modal closed');
        }}
        onStartRealTimeText={() => {
          alert('Real Time Text started');
          return Promise.resolve();
        }}
      />{' '}
    </Stack>
  );
};
