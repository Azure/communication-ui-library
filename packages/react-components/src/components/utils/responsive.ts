// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RefObject, useEffect, useState, useRef } from 'react';
import { _convertRemToPx as convertRemToPx } from '@internal/acs-ui-common';

/**
 * A utility hook for providing the width of a parent element.
 * Returns updated width if parent/window resizes.
 * @param containerRef - Ref of a parent element whose width will be returned.
 * @internal
 */
export const _useContainerWidth = (containerRef: RefObject<HTMLElement>): number | undefined => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  const observer = useRef(
    new ResizeObserver((entries) => {
      if (!entries[0]) {
        return;
      }
      const { width } = entries[0].contentRect;
      if (Number.isNaN(width)) {
        setWidth(0);
      } else {
        setWidth(width);
      }
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
 * @internal
 */
export const _useContainerHeight = (containerRef: RefObject<HTMLElement>): number | undefined => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  const observer = useRef(
    new ResizeObserver((entries) => {
      if (!entries[0]) {
        return;
      }
      const { height } = entries[0].contentRect;
      if (Number.isNaN(height)) {
        setHeight(0);
      } else {
        setHeight(height);
      }
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

const SHORT_HEIGHT_REM = 23.75;

/**
 * Utility function to determine if container width is narrow
 * @param containerWidthRem  container width in rem
 * @returns boolean
 */
export const isNarrowWidth = (containerWidthRem: number): boolean =>
  containerWidthRem <= convertRemToPx(NARROW_WIDTH_REM);

/**
 * Utility function to determine if container width is short
 * @param containerWidthRem  container height in rem
 * @returns boolean
 */
export const isShortHeight = (containerHeightRem: number): boolean =>
  containerHeightRem <= convertRemToPx(SHORT_HEIGHT_REM);
