// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartRealTimeTextButton as StartRealTimeTextButtonComponent } from '@azure/communication-react';
import React from 'react';

const StartRealTimeTextButtonStory = (): JSX.Element => {
  const [isRealTimeTextOn, setIsRealTimeTextOn] = React.useState<boolean>(false);
  return (
    <StartRealTimeTextButtonComponent
      isRealTimeTextOn={isRealTimeTextOn}
      showLabel
      onStartRealTimeText={() => {
        alert('Real-Time Text started');
        setIsRealTimeTextOn(true);
      }}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const StartRealTimeTextButton = StartRealTimeTextButtonStory.bind({});
