// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, mergeStyles, Stack } from '@fluentui/react';
import React, { CSSProperties, useMemo, useRef, useState } from 'react';
import {
  OnRenderAvatarCallback,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  BaseCustomStylesProps
} from '../../types';
import {
  horizontalGalleryContainerStyle,
  LARGE_BUTTON_SIZE,
  LARGE_BUTTON_STYLE,
  LARGE_TILE_SIZE,
  LARGE_TILE_STYLE,
  leftRightButtonStyles,
  SMALL_BUTTON_SIZE,
  SMALL_BUTTON_STYLE,
  SMALL_TILE_SIZE,
  SMALL_TILE_STYLE,
  TILE_GAP
} from '../styles/HorizontalGallery.styles';
import { useContainerWidth, isNarrowWidth } from '../utils/responsive';
import { RemoteVideoTile } from './RemoteVideoTile';

/**
 * HorizontalGallery Component Styles.
 */
export interface HorizontalGalleryStyles extends BaseCustomStylesProps {
  previousButton?: IStyle;
  nextButton?: IStyle;
}

/**
 * HorizontalGallery Component Props.
 */
export interface HorizontalGalleryProps {
  children: React.ReactNode;
  /** Space to leave on the left of this gallery in pixels. */
  leftGutter?: number;
  /** Space to leave on the right of this gallery in pixels. */
  rightGutter?: number;
  /** Default `false`. If set to true, video tiles will not render remote video stream  */
  hideRemoteVideoStream?: boolean;
  styles?: HorizontalGalleryStyles;
}

const PX_PER_REM = 16;

/**
 * Renders a horizontal gallery of video tiles.
 * @param props - HorizontalGalleryProps {@link @azure/communication-react#HorizontalGalleryProps}
 * @returns
 */
export const HorizontalGallery = (props: HorizontalGalleryProps): JSX.Element => {
  const { children, styles, leftGutter = 0.5, rightGutter = 0.5 } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isNarrow = isNarrowWidth(containerWidth);
  const [page, setPage] = useState(0);

  const maxTiles = useMemo(() => {
    setPage(0);
    if (isNarrow) {
      return calculateMaxNumberOfTiles({
        width: containerWidth - (leftGutter + rightGutter) * PX_PER_REM,
        tileWidth: SMALL_TILE_SIZE.width,
        buttonsWidth: SMALL_BUTTON_SIZE.width,
        gapBetweenTiles: TILE_GAP
      });
    } else {
      return calculateMaxNumberOfTiles({
        width: containerWidth - (leftGutter + rightGutter) * PX_PER_REM,
        tileWidth: LARGE_TILE_SIZE.width,
        buttonsWidth: LARGE_BUTTON_SIZE.width,
        gapBetweenTiles: TILE_GAP
      });
    }
  }, [containerWidth, isNarrow, leftGutter, rightGutter]);

  const numberOfChildren = React.Children.count(children);
  const maxPageIndex = Math.ceil(numberOfChildren / maxTiles) - 1;

  const defaultOnRenderChildren = useMemo(() => {
    const start = page * maxTiles;
    const end = start + maxTiles;
    return React.Children.toArray(children).slice(start, end);
  }, [page, maxTiles, children]);

  const showLeftButton = maxTiles && page > 0 && !isNarrow;
  const showRightButton = maxTiles && page < maxPageIndex && !isNarrow;

  return (
    <div ref={containerRef} className={mergeStyles(horizontalGalleryContainerStyle, props.styles?.root)}>
      {showLeftButton && (
        <PreviousButton styles={styles?.previousButton} onClick={() => setPage(Math.max(0, page - 1))} />
      )}
      {defaultOnRenderChildren}
      {showRightButton && (
        <NextButton styles={styles?.nextButton} onClick={() => setPage(Math.min(maxPageIndex, page + 1))} />
      )}
    </div>
  );
};

const calculateMaxNumberOfTiles = (args: {
  width: number;
  tileWidth: number;
  buttonsWidth: number;
  gapBetweenTiles: number;
}): number => {
  const { width, tileWidth, buttonsWidth, gapBetweenTiles } = args;
  /**
   * A Safe Padding should be reduced from the parent width to ensure that the total width of all video tiles rendered
   * is always less than the window width. (Window width after subtracting all margins, paddings etc.)
   * This ensures that video tiles don't tirgger an overflow which will prevent parent component from shrinking.
   */
  const safePadding = 1;
  return Math.floor(
    (width - buttonsWidth * PX_PER_REM - safePadding * PX_PER_REM - gapBetweenTiles * PX_PER_REM) /
      (tileWidth * PX_PER_REM + gapBetweenTiles * PX_PER_REM)
  );
};

const PreviousButton = (props: { styles: IStyle; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles)}
      onClick={props.onClick}
      styles={{ root: props.styles }}
    >
      <Icon iconName="HorizontalGalleryLeftButton" />
    </DefaultButton>
  );
};

const NextButton = (props: { styles: IStyle; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles)}
      onClick={props.onClick}
      styles={{ root: props.styles }}
    >
      <Icon iconName="HorizontalGalleryRightButton" />
    </DefaultButton>
  );
};
