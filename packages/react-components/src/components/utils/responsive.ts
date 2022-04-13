// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RefObject, useEffect, useState, useRef } from 'react';
import { convertRemToPx } from './common';

/**
 * A utility hook for providing the width of a parent element.
 * Returns updated width if parent/window resizes.
 * @param containerRef - Ref of a parent element whose width will be returned.
 * @private
 */
export const useContainerWidth = (containerRef: RefObject<HTMLElement>): number | undefined => {
  const [width, setWidth] = useState<number | undefined>(undefined);

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
 * A utility hook for providing the height of a parent element.
 * Returns updated height if parent/window resizes.
 * @param containerRef - Ref of a parent element whose height will be returned.
 * @private
 */
export const useContainerHeight = (containerRef: RefObject<HTMLElement>): number | undefined => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setHeight(height);
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

  return height;
};

const NARROW_WIDTH_REM = 30;

/**
 * Utility function to determine if container width is narrow
 * @param containerWidthRem  container width in rem
 * @returns boolean
 */
export const isNarrowWidth = (containerWidthRem: number): boolean =>
  containerWidthRem <= convertRemToPx(NARROW_WIDTH_REM);
