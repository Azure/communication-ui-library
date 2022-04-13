// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * A utility hook for providing the height of a parent element.
 * Returns updated height if parent/window resizes.
 * @param containerRef - Ref of a parent element whose height will be returned.
 * @private
 */
export const useContainerHeight = (containerRef: RefObject<HTMLDivElement>): number | undefined => {
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

/**
 * A utility hook for providing the width of a parent element.
 * Returns updated width if parent/window resizes.
 * @param containerRef - Ref of a parent element whose height will be returned.
 * @private
 */
export const useContainerWidth = (containerRef: RefObject<HTMLDivElement>): number | undefined => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setWidth(height);
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
