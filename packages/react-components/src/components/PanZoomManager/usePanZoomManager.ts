// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useRef, useState } from 'react';
import { PanZoomManager } from './PanZoomManager';
import { LayoutTransformation } from './PanZoomManager.types';

/** @private */
export const usePanAndZoomGestures = (element: HTMLElement | null): LayoutTransformation | undefined => {
  const layoutManager = useRef<PanZoomManager>();
  const [transform, setTransform] = useState<LayoutTransformation>();

  useEffect(() => {
    if (!element) {
      return;
    }

    layoutManager.current = new PanZoomManager(element);
    layoutManager.current.on('panZoomChange', (transform: LayoutTransformation) => {
      setTransform(transform);
    });

    return () => {
      layoutManager.current?.dispose();
      layoutManager.current = undefined;
      setTransform(undefined);
    };
  }, [element]);

  return transform;
};
