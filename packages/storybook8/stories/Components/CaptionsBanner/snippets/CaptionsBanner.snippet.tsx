// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBanner, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const CaptionsBannerStory = (): JSX.Element => {
  /**
   * This is a snippet for the CaptionsBanner component.
   * For this snippet we set the isCaptionsOn and isRealTimeTextOn to true so the captions banner will be visible at all times with both functionalities enabled.
   * Without setting the isCaptionsOn and isRealTimeTextOn to true, the captions banner will not be visible until start Captions is called or a first real time text message is received.
   */
  const captionsBannerProps = usePropsFor(CaptionsBanner);
  return <CaptionsBanner {...captionsBannerProps} isCaptionsOn={true} isRealTimeTextOn={true} />;
};
