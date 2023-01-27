// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGalleryStyles } from './HorizontalGallery';
import { _convertRemToPx as convertRemToPx, _pxToRem } from '@internal/acs-ui-common';
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

  const childSize = calculateChildrenSize({
    parentHeight: containerHeight,
    numberOfChildren: childrenPerPage,
    gapWidth: 4
  });

  console.log(childSize);

  if (childSize !== undefined) {
    props.verticalGalleryStyles.children = mergeStyles(props.verticalGalleryStyles.children, {
      height: _pxToRem(childSize)
    });
  }

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
  const { numberOfChildren, containerHeight, gapWidthRem } = args;

  const childMinHeight = 90;
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
   * number of children = container height - (2* gap width + button height) / childMinHeight
   *
   * we want to find the maximum number of children at the smallest size we can fit in the gallery and then resize them
   * to fill in the space as much as possible
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

const calculateChildrenSize = (args: {
  parentHeight: number | undefined;
  numberOfChildren: number;
  gapWidth: number;
}): number | undefined => {
  const childMinHeight = 90;
  const buttonHeightPx = 32;
  if (!args.parentHeight || !args.numberOfChildren) {
    return;
  }
  /**
   * we want to find the size of the child tile based on the number of children and container size
   * parentHeight = (n * childMinHeight) + (n-1 * gapSize) + buttonSize - x
   *
   * x = (n * childMinHeight) + (n-1 * gapSize) + buttonSize - parentHeight
   */
  return -(
    args.numberOfChildren * childMinHeight +
    (args.numberOfChildren - 1 * args.gapWidth) +
    buttonHeightPx -
    args.parentHeight
  );
};
