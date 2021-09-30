// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RefObject, useEffect, useState } from 'react';

/**
 * A utility hook for identifying if the current viewport size is is mobile screen.
 * Returns updated result if parent/window resizes.
 * @param containerRef - Ref of a parent element whose width will be used to determine the viewport size
 */
export const useIsMobileScreen = (containerRef: RefObject<HTMLDivElement>): boolean => {
  const MOBILE_WIDTH_MAX = 480;
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const updateWidth = (): void => {
      const width = containerRef?.current?.offsetWidth ?? 0;
      setIsMobileScreen(width <= MOBILE_WIDTH_MAX);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [containerRef]);

  return isMobileScreen;
};

/**
 * A utility hook for providing the width of a parent element.
 * Returns updated width if parent/window resizes.
 * @param containerRef - Ref of a parent element whose width will be returned.
 */
export const useContainerWidth = (containerRef: RefObject<HTMLDivElement>): number => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = (): void => {
      const width = containerRef.current?.offsetWidth ?? 0;
      setWidth(width);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [containerRef]);

  return width;
};
