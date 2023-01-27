// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGalleryStyles } from './HorizontalGallery';
import { _convertRemToPx as convertRemToPx } from '@internal/acs-ui-common';
import { _useContainerHeight, _useContainerWidth } from './utils/responsive';
import { VerticalGallery } from './VerticalGallery';

/**
 * Wrapped HorizontalGallery that adjusts the number of items per page based on the
 * available width obtained from a ResizeObserver, width per child, gap width, and button width
 */
export const ResponsiveVerticalGallery = (props: {
  children: React.ReactNode;
  containerStyles: IStyle;
  verticalGalleryStyles: HorizontalGalleryStyles;
  childHeightRem: number;
  gapWidthRem: number;
  buttonWidthRem?: number;
}): JSX.Element => {
  const { childHeightRem, gapWidthRem, buttonWidthRem = 0 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = _useContainerHeight(containerRef);

  const leftPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingLeft) : 0;
  const rightPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingRight) : 0;

  const childrenPerPage = calculateChildrenPerPage({
    numberOfChildren: React.Children.count(props.children),
    containerHeight: (containerHeight ?? 0) - leftPadding - rightPadding,
    childHeightRem,
    gapWidthRem,
    buttonWidthRem
  });

  return (
    <div ref={containerRef} className={mergeStyles(props.containerStyles)}>
      <VerticalGallery
        childrenPerPage={childrenPerPage}
        containerHeight={containerHeight}
        styles={props.verticalGalleryStyles}
      >
        {props.children}
      </VerticalGallery>
    </div>
  );
};

/**
 * Helper function to calculate children per page for HorizontalGallery based on width of container, child, buttons, and
 * gaps in between
 */
const calculateChildrenPerPage = (args: {
  numberOfChildren: number;
  containerHeight: number;
  childHeightRem: number;
  gapWidthRem: number;
  buttonWidthRem: number;
}): number => {
  const { numberOfChildren, containerHeight, childHeightRem, gapWidthRem } = args;

  const childMinHeight = 90;
  const childMaxHeight = 144;
  const gapWidth = convertRemToPx(gapWidthRem);

  const buttonHeightPx = 32;

  /** First check how many children can fit in containerHeight.
   *    _________________
   *   |                |
   *   |                |
   *   |________________|
   *    _________________
   *   |                |
   *   |                |
   *   |________________|
   *
   *
   *
   */
  const numberOfChildrenInContainer = Math.floor((containerHeight - (2 * gapWidth + buttonHeightPx)) / childMinHeight);
  // If all children fit then return numberOfChildrenInContainer
  if (numberOfChildren <= numberOfChildrenInContainer) {
    return numberOfChildrenInContainer;
  }

  // we want to maintain a height of 2rem for the button controls
  const buttonBarHeight = convertRemToPx(2);

  /** We know we need to paginate. So we need to subtract the buttonWidth twice and gapWidth twice from
   * containerHeight to compute childrenSpace
   *   <-----------containerHeight--------->
   *    __________________________________
   *   | ||             ||             || |
   *   |<||             ||             ||>|
   *   |_||_____________||_____________||_|
   *       <-------childrenSpace------>
   */
  const childrenSpace = containerHeight - 2 * buttonBarHeight - 2 * gapWidth;
  // Now that we have childrenSpace width we can figure out how many children can fit in childrenSpace.
  // childrenSpace = n * childHeightMin + (n - 1) * gapWidth. Isolate n and take the floor.
  return Math.floor((childrenSpace + gapWidth) / (childMinHeight + gapWidth));
};
