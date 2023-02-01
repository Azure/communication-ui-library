// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { _convertRemToPx as convertRemToPx, _pxToRem } from '@internal/acs-ui-common';
import { _useContainerHeight, _useContainerWidth } from './utils/responsive';
import { VerticalGallery, VerticalGalleryStyles } from './VerticalGallery';

/**
 * Wrapped HorizontalGallery that adjusts the number of items per page based on the
 * available width obtained from a ResizeObserver, width per child, gap width, and button width
 */
export const ResponsiveVerticalGallery = (props: {
  children: React.ReactNode;
  containerStyles: IStyle;
  verticalGalleryStyles: VerticalGalleryStyles;
  gapWidthRem: number;
  buttonWidthRem?: number;
}): JSX.Element => {
  const { gapWidthRem, buttonWidthRem = 0 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = _useContainerHeight(containerRef);

  const leftPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingLeft) : 0;
  const rightPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingRight) : 0;

  const childrenPerPage = calculateChildrenPerPage({
    numberOfChildren: React.Children.count(props.children),
    containerHeight: (containerHeight ?? 0) - leftPadding - rightPadding,
    gapWidthRem,
    buttonWidthRem
  });

  const childSize = calculateChildrenSize({
    parentHeight: containerHeight,
    numberOfChildren: childrenPerPage,
    gapWidth: 4
  });

  // if (childSize !== undefined) {
  //   props.verticalGalleryStyles.children = mergeStyles(props.verticalGalleryStyles.children, {
  //     height: childSize < 144 ? _pxToRem(childSize) : _pxToRem(144)
  //   });
  // }

  return (
    <div ref={containerRef} className={mergeStyles(props.containerStyles)}>
      <VerticalGallery
        childrenPerPage={childrenPerPage}
        styles={props.verticalGalleryStyles}
        childHeight={childSize ?? 90}
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
   * number of children = (container height - (2* gap width + button height)) / childMinHeight
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

  /**
   * For pagination we know the container height, the height of the button bar and the gapWidth from the last
   * tile to the button bar so its
   *
   * space = height - buttons - gap
   */
  const childrenSpace = containerHeight - buttonBarHeight - gapWidth;
  // Now that we have childrenSpace height we can figure out how many children can fit in childrenSpace.
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
   * we want to find the size of the child tile based on the number of children and container size lets
   * start with the left over space if we calculate for the min size
   *
   * parentHeight = (n * childMinHeight) + (n-1 * gapSize) + buttonSize + leftOverSpace
   *
   * parentHeight - (n * childMinHeight) + (n-1 * gapSize) + buttonSize = leftOverSpace
   */
  const leftOverSpace =
    args.parentHeight -
    (args.numberOfChildren * childMinHeight + (args.numberOfChildren - 1 * args.gapWidth) + buttonHeightPx);
  /**
   * Then we divide the rest of the left over space to each child
   */
  const childHeight = childMinHeight + leftOverSpace / args.numberOfChildren;
  return childHeight > 144 ? 144 : childHeight;
};
