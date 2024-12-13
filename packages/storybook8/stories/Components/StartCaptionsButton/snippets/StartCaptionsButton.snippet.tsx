// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartCaptionsButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useState } from 'react';

export const StartCaptionsButtonStory = (): JSX.Element => {
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
        <StartCaptionsButton
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
