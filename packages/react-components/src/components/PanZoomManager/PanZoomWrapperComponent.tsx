// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutTransformation } from './PanZoomManager.types';
import { usePanAndZoomGestures } from './usePanZoomManager';

/**
 * Wrapper component to allow child element to be panned and zoomed through mouse, touch and keyboard.
 * @private
 */
export const PanZoomWrapperComponent = (props: {
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);
  const transform = usePanAndZoomGestures(divRef.current);
  const transformCss = useMemo(() => convertTransformToCSS(transform), [transform]);

  const forceRerender = useState<number | undefined>(undefined)[1];

  // Force a rerender on mount now the useRef has updated
  useEffect(() => {
    forceRerender(Math.random);
  }, [forceRerender]);

  return (
    <div
      tabIndex={0} // needs to focusable to allow keyboard interaction - TODO: move this to allow the pan zoom manager to take in an element, e.g. for us we want to allow controls when the entire tile has focus
      aria-label={props.ariaLabel} // aria label is required because the element is focusable
      className={props.className}
      ref={divRef}
      style={transformCss} // style is used because transformed are calculated dynamically and do not depend on RTL
    >
      {props.children}
    </div>
  );
};

const convertTransformToCSS = (transform?: LayoutTransformation): CSSProperties => {
  let transformOriginCSSString = '';
  let scaleCSSString = '';
  if (transform) {
    const { transformOriginX, transformOriginY, scale } = transform;
    transformOriginCSSString = `${transformOriginX}% ${transformOriginY}%`;
    scaleCSSString = `scale(${scale})`;
  }
  return {
    transformOrigin: transformOriginCSSString,
    transform: scaleCSSString
  };
};
