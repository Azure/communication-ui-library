// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { _convertRemToPx } from '@internal/acs-ui-common';
import React, { useRef } from 'react';
import { _useContainerHeight } from './utils/responsive';
import { VerticalGallery, VerticalGalleryStyles } from './VerticalGallery';
import {
  SHORT_VERTICAL_GALLERY_TILE_SIZE_REM,
  VERTICAL_GALLERY_TILE_SIZE_REM
} from './VideoGallery/styles/VideoGalleryResponsiveVerticalGallery.styles';

/**
 * Props for the Responsive wrapper of the VerticalGallery component
 *
 * @beta
 */
export interface ResponsiveVerticalGalleryProps {
  /** Video tiles to be rendered in the Vertical Gallery */
  children: React.ReactNode;
  /** Styles for the Children space container */
  containerStyles: IStyle;
  /** Styles for the VerticalGallery component */
  verticalGalleryStyles: VerticalGalleryStyles;
  /** Height of the gap in between the video tiles */
  gapHeightRem: number;
  /** Height of the control bar for navigating pages */
  controlBarHeightRem?: number;
  /** container is shorter than 480 px. */
  isShort?: boolean;
  /** Function to set which tiles to give video to in the children. */
  onFetchTilesToRender?: (indexes: number[]) => void;
}

/**
 * Responsive container for the VerticalGallery Component. Performs calculations for number of children
 * for the VerticalGallery
 * @param props
 *
 * @beta
 */
export const ResponsiveVerticalGallery = (props: ResponsiveVerticalGalleryProps): JSX.Element => {
  const {
    children,
    containerStyles,
    verticalGalleryStyles,
    gapHeightRem,
    controlBarHeightRem,
    isShort,
    onFetchTilesToRender
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = _useContainerHeight(containerRef);

  const topPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingTop) : 0;
  const bottomPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingBottom) : 0;

  const childrenPerPage = calculateChildrenPerPage({
    numberOfChildren: React.Children.count(children),
    containerHeight: (containerHeight ?? 0) - topPadding - bottomPadding,
    gapHeightRem,
    controlBarHeight: controlBarHeightRem ?? 2,
    isShort: isShort ?? false
  });
  return (
    <div data-ui-id="responsive-vertical-gallery" ref={containerRef} className={mergeStyles(containerStyles)}>
      <VerticalGallery
        childrenPerPage={childrenPerPage}
        styles={verticalGalleryStyles}
        onFetchTilesToRender={onFetchTilesToRender}
      >
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
  isShort: boolean;
}): number => {
  const { numberOfChildren, containerHeight, gapHeightRem, controlBarHeight, isShort } = args;

  const childMinHeightPx = _convertRemToPx(
    isShort ? SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.minHeight : VERTICAL_GALLERY_TILE_SIZE_REM.minHeight
  );
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
   * number of children = container height - (2* gap height + button height) / childMinHeight
   *
   * we want to find the maximum number of children at the smallest size we can fit in the gallery and then resize them
   * to fill in the space as much as possible
   *
   * First we will find the max number of children without any controls we can fit.
   */

  const maxNumberOfChildrenInContainer = Math.floor((containerHeight + gapHeightPx) / (childMinHeightPx + gapHeightPx));
  // if all of the children fit in the container just return the number of children
  if (numberOfChildren <= maxNumberOfChildrenInContainer) {
    return maxNumberOfChildrenInContainer;
  }

  /**
   * For the pagination we know the container height, the height of the button bar and the 2 times the gap
   * height, top tile and bottom tile above control bar. So the child space is calculated as:
   *
   *      space = height - controlbar - (2 * gap)
   */
  const childSpace = containerHeight - controlBarHeightPx - 2 * gapHeightPx;

  /**
   * Now that we have the childrenSpace height we can figure out how many Children can fir in the childrenSpace.
   * childrenSpace = n * childHeightMin + (n - 1) * gapHeight. isolate n and take the floor.
   *
   * We want to always return at least one video tile if there are children present.So we take the max.
   */
  return Math.max(Math.floor((childSpace + gapHeightPx) / (childMinHeightPx + gapHeightPx)), 1);
};
