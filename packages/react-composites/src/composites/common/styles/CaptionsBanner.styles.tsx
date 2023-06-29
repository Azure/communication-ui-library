// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles } from '@fluentui/react';

const mobileViewBannerWidth = '90%';

const desktopViewBannerWidth = '50%';

/**
 * @private
 */
export const captionsBannerContainerStyles = (isMobile: boolean): IStackStyles => {
  return {
    root: {
      width: isMobile ? mobileViewBannerWidth : desktopViewBannerWidth,
      height: isMobile ? '4.5rem' : '6.25rem',
      overflowY: 'auto'
    }
  };
};
