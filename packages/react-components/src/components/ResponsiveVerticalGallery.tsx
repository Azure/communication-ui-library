// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { _convertRemToPx } from '@internal/acs-ui-common';
import React, { useRef } from 'react';
import { _useContainerHeight } from './utils/responsive';
import { VerticalGallery, VerticalGalleryStyles } from './VerticalGallery';

export interface ResponsiveVerticalGalleryProps {
  children: React.ReactNode;
  containerStyles: IStyle;
  verticalGalleryStyles: VerticalGalleryStyles;
  gapHeightRem: number;
  controlBarHeightRem?: number;
}

/**
 * Responsive container for the VerticalGallery Component. Performs calculations for number of children
 * for the VerticalGallery
 * @param props
 *
 * @beta
 */
export const ResponsiveVerticalGallery = (props: ResponsiveVerticalGalleryProps): JSX.Element => {
  const { children, containerStyles, verticalGalleryStyles, gapHeightRem, controlBarHeightRem } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = _useContainerHeight(containerRef);

  const topPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingTop) : 0;
  const bottomPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingBottom) : 0;

  const childrenPerPage = calculateChildrenPerPage({
    numberOfChildren: React.Children.count(children),
    containerHeight: (containerHeight ?? 0) - topPadding - bottomPadding,
    gapHeightRem,
    controlBarHeight: controlBarHeightRem ?? 2
  });
  return (
    <div ref={containerRef} className={mergeStyles(containerStyles)}>
      <VerticalGallery childrenPerPage={childrenPerPage} styles={verticalGalleryStyles}>
        {children}
      </VerticalGallery>
    </div>
  );
};

/**
 * Helper function to find the number of children for the VerticalGallery on each page.
 */
const calculateChildrenPerPage = (args: {
  numberOfChildren: number;
  containerHeight: number;
  gapHeightRem: number;
  controlBarHeight: number;
}): number => {
  const { numberOfChildren, containerHeight, gapHeightRem, controlBarHeight } = args;

  const childMinHeightPx = 90;
  const gapHeightPx = _convertRemToPx(gapHeightRem);
  const controlBarHeightPx = _convertRemToPx(controlBarHeight);

  /** First check how many children can fit in containerHeight.
   *
   *   _________________
   *   |                |
   *   |                |
   *   |________________|
   *    _________________
   *   |                |
   *   |                |
   *   |________________|
   *
   *      <   n/m   >
   *
   * number of children = container height - (2* gap width + button height) / childMinHeight
   *
   * we want to find the maximum number of children at the smallest size we can fit in the gallery and then resize them
   * to fill in the space as much as possible
   */

  const numberOfChildrenInContainer = Math.floor(
    (containerHeight - (2 * gapHeightPx + controlBarHeightPx)) / childMinHeightPx
  );
  // if all of the children fit in the container just return the number of children
  if (numberOfChildren <= numberOfChildrenInContainer) {
    return numberOfChildrenInContainer;
  }

  /**
   * For the paginastion we know the container height, the height of the button bar and the 2 times the gap
   * height, top tile and bottom tile above control bar. So the child space is calculated as:
   *
   *      space = height - controlbar - (2 * gap)
   */
  const childSpace = containerHeight - controlBarHeightPx - 2 * gapHeightPx;
  /**
   * Now that we have the childrenSpace height we can figure out how many Children can fir in the childrenSpace.
   * childrenSpace = n * childHeightMin + (n - 1) * gapWidth. isolate n and take the floor.
   */
  return Math.floor((childSpace + gapHeightPx) / (childMinHeightPx + gapHeightPx));
};
