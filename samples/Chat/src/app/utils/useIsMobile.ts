// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect, useState } from 'react';
import MobileDetect from 'mobile-detect';

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

/**
 * Detect if the app is running in a mobile browser and updated if that changes (e.g. when switching to a mobile browser in a browser emulator)
 * @returns true if this detects the app is running in a mobile browser
 */
export const useIsMobile = (): boolean => {
  // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
  const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());
  useEffect(() => {
    const updateIsMobile = (): void => {
      // The userAgent string is sometimes not updated synchronously when the `resize` event fires.
      setTimeout(() => {
        setIsMobileSession(detectMobileSession());
      });
    };
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  return isMobileSession;
};
