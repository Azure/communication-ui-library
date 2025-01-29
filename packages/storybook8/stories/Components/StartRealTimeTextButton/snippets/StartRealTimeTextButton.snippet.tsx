// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartRealTimeTextButton } from '@azure/communication-react';
import React from 'react';

export const StartRealTimeTextButtonStory = (): JSX.Element => {
  const [isRealTimeTextOn, setIsRealTimeTextOn] = React.useState<boolean>(false);
  return (
    <StartRealTimeTextButton
      isRealTimeTextOn={isRealTimeTextOn}
      showLabel
      onStartRealTimeText={() => {
        alert('Real-Time Text started');
        setIsRealTimeTextOn(true);
      }}
    />
  );
};
