// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _convertRemToPx as convertRemToPx } from '@internal/acs-ui-common';
import {
  SHORT_VERTICAL_GALLERY_TILE_SIZE_REM,
  VERTICAL_GALLERY_TILE_SIZE_REM
} from '../styles/VideoGalleryResponsiveVerticalGallery.styles';

/**
 * Helper function to calculate children per page for HorizontalGallery based on width of container, child, buttons, and
 * gaps in between
 *
 * @private
 */
export const calculateHorizontalChildrenPerPage = (args: {
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

/**
 * Helper function to find the number of children for the VerticalGallery on each page.
 *
 * @private
 */
export const calculateVerticalChildrenPerPage = (args: {
  numberOfChildren: number;
  containerHeight: number;
  gapHeightRem: number;
  controlBarHeight: number;
  isShort: boolean;
}): number => {
  const { numberOfChildren, containerHeight, gapHeightRem, controlBarHeight, isShort } = args;

  const childMinHeightPx = convertRemToPx(
    isShort ? SHORT_VERTICAL_GALLERY_TILE_SIZE_REM.minHeight : VERTICAL_GALLERY_TILE_SIZE_REM.minHeight
  );
  const gapHeightPx = convertRemToPx(gapHeightRem);
  const controlBarHeightPx = convertRemToPx(controlBarHeight);

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
