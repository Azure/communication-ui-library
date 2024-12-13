// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartCaptionsButton as StartCaptionsButtonComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useState } from 'react';

const StartCaptionsButtonStory = (): JSX.Element => {
  const [isCaptionsActive, setIsCaptionsActive] = useState<boolean>(false);

  const onStartCaptions = async (): Promise<void> => {
    setIsCaptionsActive(true);
    Promise.resolve();
  };

  const onStopCaptions = async (): Promise<void> => {
    setIsCaptionsActive(false);
    Promise.resolve();
  };

  const onSetSpokenLanguage = async (language: string): Promise<void> => {
    alert(`Spoken language set to ${language}`);
    Promise.resolve();
  };

  return (
    <Stack style={{ border: 'solid grey 0.1rem' }} horizontalAlign="center">
      <Stack.Item style={{ width: '60%' }}>
        <StartCaptionsButtonComponent
          onStartCaptions={onStartCaptions}
          onStopCaptions={onStopCaptions}
          onSetSpokenLanguage={onSetSpokenLanguage}
          currentSpokenLanguage="en-us"
          checked={isCaptionsActive}
        />
      </Stack.Item>
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const StartCaptionsButton = StartCaptionsButtonStory.bind({});
