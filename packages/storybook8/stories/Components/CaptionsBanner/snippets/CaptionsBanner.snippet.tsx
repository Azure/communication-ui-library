// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBanner, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const CaptionsBannerStory = (): JSX.Element => {
  const captionsBannerProps = usePropsFor(CaptionsBanner);
  return (
    <>
      {(captionsBannerProps?.isCaptionsOn || captionsBannerProps?.isRealTimeTextOn) && (
        <CaptionsBanner {...captionsBannerProps} />
      )}
    </>
  );
};
