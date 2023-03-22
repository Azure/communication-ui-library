// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { _convertRemToPx } from '@internal/acs-ui-common';
import React, { useRef } from 'react';
import { _useContainerHeight } from './utils/responsive';
import { VerticalGallery, VerticalGalleryStyles } from './VerticalGallery';
import { calculateVerticalChildrenPerPage } from './VideoGallery/utils/OverflowGalleryUtils';

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

  const childrenPerPage = calculateVerticalChildrenPerPage({
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
