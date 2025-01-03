// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { RealTimeText } from '@internal/react-components';
import React from 'react';

export const ExampleRealTimeText = (): JSX.Element => {
  return (
    <Stack style={{ padding: '0.5rem' }}>
      <RealTimeText id="1" displayName="Caroline" captionText="Hello I am Caroline" isTyping />
    </Stack>
  );
};
