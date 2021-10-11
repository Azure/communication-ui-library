// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RefObject, useEffect, useState, useRef } from 'react';

/**
 * A utility hook for providing the width of a parent element.
 * Returns updated width if parent/window resizes.
 * @param containerRef - Ref of a parent element whose width will be returned.
 */
export const useContainerWidth = (containerRef: RefObject<HTMLDivElement>): number => {
  const [width, setWidth] = useState(0);

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setWidth(width);
    })
  );

  useEffect(() => {
    if (containerRef.current) {
      observer.current.observe(containerRef.current);
    }

    const currentObserver = observer.current;
    return () => {
      currentObserver.disconnect();
    };
  }, [containerRef, observer]);

  return width;
};

/**
 * A utility hook for identifying if the current viewport size is is a small screen i.e., < 480px.
 * Returns updated result if parent/window resizes.
 * @param containerRef - Ref of a parent element whose width will be used to determine the viewport size
 */
export const useIsSmallScreen = (containerRef: RefObject<HTMLDivElement>): boolean => {
  const MOBILE_WIDTH_MAX = 480;
  const containerWidth = useContainerWidth(containerRef);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    setIsMobileScreen(containerWidth <= MOBILE_WIDTH_MAX);
  }, [containerRef, containerWidth]);

  return isMobileScreen;
};
