// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGallery, HorizontalGalleryStyles } from './HorizontalGallery';
import { _convertRemToPx as convertRemToPx } from '@internal/acs-ui-common';
import { _useContainerWidth } from './utils/responsive';

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
  onFetchTilesToRender?: (indexes: number[]) => void;
}): JSX.Element => {
  const { childWidthRem, gapWidthRem, buttonWidthRem = 0, onFetchTilesToRender } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);

  const leftPadding = containerRef.current
    ? !isNaN(parseFloat(getComputedStyle(containerRef.current).paddingLeft))
      ? parseFloat(getComputedStyle(containerRef.current).paddingLeft)
      : 0
    : 0;
  const rightPadding = containerRef.current
    ? !isNaN(parseFloat(getComputedStyle(containerRef.current).paddingRight))
      ? parseFloat(getComputedStyle(containerRef.current).paddingRight)
      : 0
    : 0;
  console.log(leftPadding);
  console.log(rightPadding);
  const childrenPerPage = calculateChildrenPerPage({
    numberOfChildren: React.Children.count(props.children),
    containerWidth: (containerWidth ?? 0) - leftPadding - rightPadding,
    childWidthRem,
    gapWidthRem,
    buttonWidthRem
  });

  return (
    <div data-ui-id="responsive-horizontal-gallery" ref={containerRef} className={mergeStyles(props.containerStyles)}>
      <HorizontalGallery
        childrenPerPage={childrenPerPage}
        styles={props.horizontalGalleryStyles}
        onFetchTilesToRender={onFetchTilesToRender}
      >
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
  containerWidth: number;
  childWidthRem: number;
  gapWidthRem: number;
  buttonWidthRem: number;
}): number => {
  const { numberOfChildren, containerWidth, buttonWidthRem, childWidthRem, gapWidthRem } = args;

  const childWidth = convertRemToPx(childWidthRem);
  const gapWidth = convertRemToPx(gapWidthRem);

  /** First check how many children can fit in containerWidth.
   *    __________________________________
   *   |                ||                |
   *   |                ||                |
   *   |________________||________________|
   *   <-----------containerWidth--------->
   *  containerWidth = n * childWidth + (n - 1) * gapWidth. Isolate n and take the floor.
   */
  const numberOfChildrenInContainer = Math.floor((containerWidth + gapWidth) / (childWidth + gapWidth));
  // If all children fit then return numberOfChildrenInContainer
  if (numberOfChildren <= numberOfChildrenInContainer) {
    return numberOfChildrenInContainer;
  }

  const buttonWidth = convertRemToPx(buttonWidthRem);

  /** We know we need to paginate. So we need to subtract the buttonWidth twice and gapWidth twice from
   * containerWidth to compute childrenSpace
   *   <-----------containerWidth--------->
   *    __________________________________
   *   | ||             ||             || |
   *   |<||             ||             ||>|
   *   |_||_____________||_____________||_|
   *       <-------childrenSpace------>
   */
  const childrenSpace = containerWidth - 2 * buttonWidth - 2 * gapWidth;
  // Now that we have childrenSpace width we can figure out how many children can fit in childrenSpace.
  // childrenSpace = n * childWidth + (n - 1) * gapWidth. Isolate n and take the floor.
  return Math.max(Math.floor((childrenSpace + gapWidth) / (childWidth + gapWidth)), 1);
};
