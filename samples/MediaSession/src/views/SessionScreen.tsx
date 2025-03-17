// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBar, MicrophoneButton, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const SessionScreen = (): JSX.Element => {
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  return (
    <Stack
      id="session-screen"
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      tokens={{ childrenGap: '1rem' }}
    >
      <Stack.Item>
        <ControlBar layout="floatingBottom">
          <MicrophoneButton {...microphoneButtonProps} enableDeviceSelectionMenu={true} />
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};
