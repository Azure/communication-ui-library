// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MicrophoneButton, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const SessionScreen = (): JSX.Element => {
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      <MicrophoneButton {...microphoneButtonProps} />
    </Stack>
  );
};
