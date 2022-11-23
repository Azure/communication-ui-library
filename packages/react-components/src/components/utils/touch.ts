// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 * @private
 */
export const useLongTouch = (ref: React.RefObject<HTMLElement>, onLongTouch: () => void): void => {
  const longTouchTimeout = React.useRef<number | undefined>(undefined);
  const longTouchTimeoutDuration = 700; // 700ms

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const onTouchStart = (): void => {
      console.log('onTouchStart');
      longTouchTimeout.current = window.setTimeout(onLongTouch, longTouchTimeoutDuration);
    };

    const onTouchEnd = (): void => {
      console.log('onTouchEnd');
      if (longTouchTimeout.current) {
        window.clearTimeout(longTouchTimeout.current);
      }
    };

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchend', onTouchEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
    };
  });
};
