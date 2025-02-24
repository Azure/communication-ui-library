// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeTextModal } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
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
        }}
      />{' '}
    </Stack>
  );
};
