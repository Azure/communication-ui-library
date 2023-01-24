// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGallery, HorizontalGalleryStyles } from './HorizontalGallery';
import { _convertRemToPx as convertRemToPx } from '@internal/acs-ui-common';
import { _useContainerHeight, _useContainerWidth } from './utils/responsive';

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
      <HorizontalGallery childrenPerPage={childrenPerPage} styles={props.verticalGalleryStyles}>
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
  numberOfChildren: number;
  containerHeight: number;
  childHeightRem: number;
  gapWidthRem: number;
  buttonWidthRem: number;
}): number => {
  const { numberOfChildren, containerHeight, buttonWidthRem, childHeightRem, gapWidthRem } = args;

  const childHeight = convertRemToPx(childHeightRem);
  const gapWidth = convertRemToPx(gapWidthRem);

  /** First check how many children can fit in containerHeight.
   *    __________________________________
   *   |                ||                |
   *   |                ||                |
   *   |________________||________________|
   *   <-----------containerHeight--------->
   *    _________________
   *   |                |
   *   |                |
   *   |________________|
   *    _________________
   *   |                |
   *   |                |
   *   |________________|
   *
   * containerHeight = n * childHeight + (n - 1) * gapWidth
   *
   *  containerHeight = n * childWidth + (n - 1) * gapWidth. Isolate n and take the floor.
   */
  const numberOfChildrenInContainer = Math.floor((containerHeight + gapWidth) / (childHeight + gapWidth));
  // If all children fit then return numberOfChildrenInContainer
  if (numberOfChildren <= numberOfChildrenInContainer) {
    return numberOfChildrenInContainer;
  }

  const buttonWidth = convertRemToPx(buttonWidthRem);

  /** We know we need to paginate. So we need to subtract the buttonWidth twice and gapWidth twice from
   * containerHeight to compute childrenSpace
   *   <-----------containerHeight--------->
   *    __________________________________
   *   | ||             ||             || |
   *   |<||             ||             ||>|
   *   |_||_____________||_____________||_|
   *       <-------childrenSpace------>
   */
  const childrenSpace = containerHeight - 2 * buttonWidth - 2 * gapWidth;
  // Now that we have childrenSpace width we can figure out how many children can fit in childrenSpace.
  // childrenSpace = n * childWidth + (n - 1) * gapWidth. Isolate n and take the floor.
  return Math.floor((childrenSpace + gapWidth) / (childHeight + gapWidth));
};
