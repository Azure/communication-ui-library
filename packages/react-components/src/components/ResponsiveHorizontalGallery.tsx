// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGallery, HorizontalGalleryStyles } from './HorizontalGallery';
import { convertRemToPx } from './utils/common';
import { useContainerWidth } from './utils/responsive';

/**
 * Wrapped HorizontalGallery that adjusts the number of items per page based on the
 * available width obtained from a ResizeObserver, width per child, gap width, and button width
 */
export const ResponsiveHorizontalGallery = (props: {
  children: React.ReactNode;
  containerStyles: IStyle;
  horizontalGalleryStyles: HorizontalGalleryStyles;
  childWidthRem: number;
  gapWidthRem: number;
  buttonWidthRem?: number;
}): JSX.Element => {
  const { childWidthRem, gapWidthRem, buttonWidthRem = 0 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  const leftPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingLeft) : 0;
  const rightPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingRight) : 0;

  const childrenPerPage = calculateChildrenPerPage({
    containerWidth: containerWidth - leftPadding - rightPadding,
    childWidthRem,
    gapWidthRem,
    buttonWidthRem
  });

  return (
    <div ref={containerRef} className={mergeStyles(props.containerStyles)}>
      <HorizontalGallery childrenPerPage={childrenPerPage} styles={props.horizontalGalleryStyles}>
        {props.children}
      </HorizontalGallery>
    </div>
  );
};

/**
 * Helper function to calculate children per page for HorizontalGallery based on width of container, child, buttons, and
 * gaps in between
 */
const calculateChildrenPerPage = (args: {
  containerWidth: number;
  childWidthRem: number;
  gapWidthRem: number;
  buttonWidthRem: number;
}): number => {
  const { containerWidth, buttonWidthRem, childWidthRem, gapWidthRem } = args;

  const buttonWidth = convertRemToPx(buttonWidthRem);
  const childWidth = convertRemToPx(childWidthRem);
  const gapWidth = convertRemToPx(gapWidthRem);

  /** First compute childrenSpace from container width
   *   <-----------containerWidth--------->
   *    __________________________________
   *   | ||             ||             || |
   *   |<||             ||             ||>|
   *   |_||_____________||_____________||_|
   *       <-------childrenSpace------>
   */
  const childrenSpace = containerWidth - 2 * buttonWidth - 2 * gapWidth;
  // Now that we have childrenSpace width we can figure out how many children can fit in childrenSpace.
  // childrenSpace = n * childWidth + (n + 1) * gap. Isolate n and take the floor.
  return Math.floor((childrenSpace + gapWidth) / (childWidth + gapWidth));
};
