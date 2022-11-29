// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, mergeStyles, Stack } from '@fluentui/react';
import React, { useRef } from 'react';
import { GridLayoutStyles } from '..';
import { useIdentifiers } from '../../identifiers/IdentifierProvider';
import { BaseCustomStyles } from '../../types';
import { GridLayout } from '../GridLayout';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { ResponsiveHorizontalGallery } from '../ResponsiveHorizontalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
import {
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  videoGalleryContainerStyle,
  videoGalleryOuterDivStyle
} from '../styles/VideoGallery.styles';
import { isNarrowWidth, _useContainerWidth } from '../utils/responsive';

/**
 * {@link DefaultLayoutStyles} Component Styles.
 * @public
 */
export interface DefaultLayoutStyles extends BaseCustomStyles {
  /** Styles for the grid layout */
  gridLayout?: GridLayoutStyles;
  /** Styles for the horizontal gallery  */
  horizontalGallery?: HorizontalGalleryStyles;
}

/**
 * Props for {@link VideoGallery}.
 *
 * @public
 */
export interface _DefaultLayoutProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <DefaultLayout styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: DefaultLayoutStyles;

  gridComponents?: JSX.Element[];

  horizontalGalleryComponents?: JSX.Element[];
}

/**
 * VideoGallery represents a layout of video tiles for a specific call.
 * It displays a {@link VideoTile} for the local user as well as for each remote participant who has joined the call.
 *
 * @public
 */
export const _DefaultLayout = (props: _DefaultLayoutProps): JSX.Element => {
  const { gridComponents, horizontalGalleryComponents, styles } = props;

  const ids = useIdentifiers();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const isNarrow = containerWidth ? isNarrowWidth(containerWidth) : false;

  return (
    <div
      data-ui-id={ids.videoGallery}
      ref={containerRef}
      className={mergeStyles(videoGalleryOuterDivStyle, styles?.root)}
    >
      <Stack horizontal={false} styles={videoGalleryContainerStyle}>
        <GridLayout key="grid-layout" styles={styles?.gridLayout}>
          {gridComponents}
        </GridLayout>
        {horizontalGalleryComponents && (
          <div style={{ paddingTop: '0.5rem' }}>
            <ResponsiveHorizontalGallery
              key="responsive-horizontal-gallery"
              containerStyles={horizontalGalleryContainerStyle(false, isNarrow)}
              horizontalGalleryStyles={concatStyleSets(horizontalGalleryStyle(isNarrow), styles?.horizontalGallery)}
              childWidthRem={
                isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
              }
              buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
              gapWidthRem={HORIZONTAL_GALLERY_GAP}
            >
              {horizontalGalleryComponents}
            </ResponsiveHorizontalGallery>
          </div>
        )}
      </Stack>
    </div>
  );
};
