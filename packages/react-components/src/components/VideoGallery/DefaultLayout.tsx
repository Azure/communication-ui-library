// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useRef } from 'react';
import { GridLayoutStyles } from '..';
import { useIdentifiers } from '../../identifiers/IdentifierProvider';
import { BaseCustomStyles } from '../../types';
import { GridLayout } from '../GridLayout';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { isNarrowWidth, _useContainerWidth } from '../utils/responsive';
import { videoGalleryContainerStyle, videoGalleryOuterDivStyle } from './styles/DefaultLayout.styles';
import { VideoGalleryResponsiveHorizontalGallery } from './VideoGalleryResponsiveHorizontalGallery';

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
 * Props for {@link DefaultLayout}.
 *
 * @private
 */
export interface DefaultLayoutProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <DefaultLayout styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: DefaultLayoutStyles;
  /**
   * Elements to display in the grid
   */
  gridElements?: JSX.Element[];
  /**
   * Elements to display in the horizontal gallery
   */
  horizontalGalleryElements?: JSX.Element[];
}

/**
 * DefaultLayout displays elements passed to `gridComponents` prop in the grid area and elements passed to
 * `horizontalGalleryComponents` prop in the horizontal gallery area.
 *
 * @private
 */
export const DefaultLayout = (props: DefaultLayoutProps): JSX.Element => {
  const { gridElements, horizontalGalleryElements, styles } = props;

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
          {gridElements}
        </GridLayout>
        {horizontalGalleryElements && horizontalGalleryElements.length > 0 && (
          <VideoGalleryResponsiveHorizontalGallery
            isNarrow={isNarrow}
            horizontalGalleryElements={horizontalGalleryElements}
            styles={styles?.horizontalGallery}
          />
        )}
      </Stack>
    </div>
  );
};
