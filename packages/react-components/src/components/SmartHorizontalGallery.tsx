// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGallery } from './HorizontalGallery';
import { useContainerWidth } from './utils/responsive';

/**
 * Wrapped HorizontalGallery that adjusts the number of items per page based on the
 * available width obtained from a ResizeObserver, width per child, gap width, and button width
 * @param props
 * @returns
 */
export const SmartHorizontalGallery = (props: {
  containerStyles: IStyle;
  children: React.ReactNode;
  childWidthRem: number;
  gapWidthRem: number;
  buttonWidthRem?: number;
}): JSX.Element => {
  const { childWidthRem, gapWidthRem, buttonWidthRem = 0 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  const childrenPerPage = calculateChildrenPerPage({ containerWidth, childWidthRem, gapWidthRem, buttonWidthRem });

  return (
    <div ref={containerRef} className={mergeStyles(props.containerStyles)}>
      <HorizontalGallery
        itemsPerPage={childrenPerPage}
        styles={{
          previousButton: buttonWidthRem > 0 ? { width: `${props.buttonWidthRem}rem` } : { display: 'none' },
          nextButton: buttonWidthRem > 0 ? { width: `${props.buttonWidthRem}rem` } : { display: 'none' }
        }}
      >
        {props.children}
      </HorizontalGallery>
    </div>
  );
};

/**
 * Helper function to calculate children per page for HorizontalGallery based on containerWidth.
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

  /** First, figure out childrenSpace if there are buttons
   *   <-----------containerWidth--------->
   *    __________________________________
   *   | ||             ||             || |
   *   |<||             ||             ||>|
   *   |_||_____________||_____________||_|
   *       <-------childrenSpace------>
   *              OR no buttons
   *    __________________________________
   *   |                ||                |
   *   |                ||                |
   *   |________________||________________|
   *   <-----------childrenSpace--------->
   */
  let childrenSpace = containerWidth;
  if (buttonWidth !== 0) {
    // need to subtract width of buttons. Always leaving room for both buttons even though there may
    // not be there for first and last page.
    childrenSpace -= 2 * buttonWidth;
    // need to subtract 2 gaps for buttons
    childrenSpace -= 2 * gapWidth;
  }
  // Now that we have childrenSpace width we can figure out how many children can fit in childrenSpace.
  // childrenSpace = n * childWidth + (n - 1) * gap. Isolate n and take the floor.
  return Math.floor((childrenSpace + gapWidth) / (childWidth + gapWidth));
};

const convertRemToPx = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};
