// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { RTT as RTTExample } from '@internal/react-components';
import React from 'react';

const RTTStory = (args: { isTyping: boolean; displayName: string; captionText: string }): JSX.Element => {
  return (
    <Stack>
      <RTTExample
        id="1"
        displayName={args.displayName ?? 'Caroline'}
        captionText={args.captionText ?? 'Hello'}
        isTyping={args.isTyping}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RTT = RTTStory.bind({});
