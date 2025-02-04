// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeText } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const ExampleRealTimeText = (): JSX.Element => {
  return (
    <Stack style={{ padding: '0.5rem' }}>
      <RealTimeText id={1} displayName="Caroline" message="Hello I am Caroline" isTyping />
    </Stack>
  );
};
