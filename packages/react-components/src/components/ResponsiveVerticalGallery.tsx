// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';
import { _convertRemToPx } from '@internal/acs-ui-common';
import React, { useRef } from 'react';
import { VerticalGallery, VerticalGalleryStyles } from './VerticalGallery';

export interface ResponsiveVerticalGalleryProps {
  children: React.ReactNode;
  containerStyles: IStyle;
  verticalGalleryStyles: VerticalGalleryStyles;
  gapWidthRem: number;
  buttonWidthRem?: number;
}

/**
 * Responsive container for the VerticalGallery Component. Performs calculations for number of children
 * for the VerticalGallery
 * @param props
 *
 * @beta
 */
export const ResponsiveVerticalGallery = (props: ResponsiveVerticalGalleryProps): JSX.Element => {
  const { children, containerStyles, verticalGalleryStyles, childWidthRem, gapWidthRem, buttonWidthRem } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef}>
      <VerticalGallery />
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
}): number => {
  const { numberOfChildren, containerHeight, gapHeightRem } = args;

  const childMinHeightPx = 90;
  const gapHeightPx = _convertRemToPx(gapHeightRem);
  const controlBarHeightPx = 32;

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
};
