// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef } from 'react';
import { HorizontalGallery, HorizontalGalleryStyles } from './HorizontalGallery';
import { _useContainerWidth } from './utils/responsive';
import { calculateHorizontalChildrenPerPage } from './VideoGallery/utils/OverflowGalleryUtils';

/**
 * Wrapped HorizontalGallery that adjusts the number of items per page based on the
 * available width obtained from a ResizeObserver, width per child, gap width, and button width
 */
export const ResponsiveHorizontalGallery = (props: {
  children: React.ReactNode;
  containerStyles: IStyle;
  horizontalGalleryStyles: HorizontalGalleryStyles;
  gapWidthRem: number;
  buttonWidthRem?: number;
  onFetchTilesToRender?: (indexes: number[]) => void;
  /** event to listen for children per page changes */
  onChildrenPerPageChange?: (childrenPerPage: number) => void;
}): JSX.Element => {
  const { gapWidthRem, buttonWidthRem = 0, onFetchTilesToRender, onChildrenPerPageChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);

  const leftPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingLeft) : 0;
  const rightPadding = containerRef.current ? parseFloat(getComputedStyle(containerRef.current).paddingRight) : 0;

  const childrenPerPage = calculateHorizontalChildrenPerPage({
    numberOfChildren: React.Children.count(props.children),
    containerWidth: (containerWidth ?? 0) - leftPadding - rightPadding,
    gapWidthRem,
    buttonWidthRem
  });
  onChildrenPerPageChange?.(childrenPerPage);

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
