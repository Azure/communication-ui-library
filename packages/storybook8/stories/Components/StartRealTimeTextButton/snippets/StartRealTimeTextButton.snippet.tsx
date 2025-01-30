// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBanner, StartRealTimeTextButton, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const StartRealTimeTextButtonStory = (): JSX.Element => {
  /**
   * In this example snippet we show case how to add a button to start real-time text
   * The start button will enable real-time text for the local user so the user can start typing
   * Once the first real-time text message is sent, real-time text will be enabled automatically for all participants.
   * The start button is disabled when real-time text is on
   */

  const [isRealTimeTextOn, setIsRealTimeTextOn] = React.useState<boolean>(false);
  const captionsBannerProps = usePropsFor(CaptionsBanner);
  return (
    <StartRealTimeTextButton
      isRealTimeTextOn={captionsBannerProps.isRealTimeTextOn || isRealTimeTextOn}
      showLabel
      onStartRealTimeText={() => {
        alert('Real-Time Text started');
        setIsRealTimeTextOn(true);
      }}
    />
  );
};
