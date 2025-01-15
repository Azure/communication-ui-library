// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { RealTimeText as RealTimeTextExample } from '@internal/react-components';
import React from 'react';

const RealTimeTextStory = (args: { isTyping: boolean; displayName: string; message: string }): JSX.Element => {
  return (
    <Stack>
      <RealTimeTextExample
        id={1}
        displayName={args.displayName ?? 'Caroline'}
        message={args.message ?? 'Hello'}
        isTyping={args.isTyping}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RealTimeText = RealTimeTextStory.bind({});
