// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFunction } from '@fluentui/react';
import React from 'react';
import { useTheme } from '../../theming/FluentThemeProvider';
import { VideoTile, VideoTileProps, VideoTileStylesProps } from '../VideoTile';

/** @internal */
export type _TileOrientation = 'portrait' | 'landscape';

/** @internal */
export interface _PictureInPictureInPictureTileProps
  extends Pick<
    VideoTileProps,
    'styles' | 'displayName' | 'renderElement' | 'isMirrored' | 'noVideoAvailableAriaLabel'
  > {
  orientation: _TileOrientation;
}

/** @private */
export const PictureInPictureInPicturePrimaryTile = (props: _PictureInPictureInPictureTileProps): JSX.Element => {
  const boxShadow = useTheme().effects.elevation8;
  return <PictureInPictureInPictureTile {...props} styles={primaryTileStyles(props.orientation, boxShadow)} />;
};

/** @private */
export const PictureInPictureInPictureSecondaryTile = (props: _PictureInPictureInPictureTileProps): JSX.Element => (
  <PictureInPictureInPictureTile {...props} styles={secondaryTileStyles(props.orientation)} />
);

const PictureInPictureInPictureTile = (props: VideoTileProps): JSX.Element => (
  <VideoTile {...props} showLabel={false} />
);

const primaryTileStyles = memoizeFunction(
  (orientation: _TileOrientation, themeElevation: string): VideoTileStylesProps => ({
    root: {
      borderRadius: '0.25rem',
      height: orientation === 'landscape' ? '5.5rem' : '8rem',
      width: orientation === 'landscape' ? '8rem' : '5.5rem',
      boxShadow: themeElevation
    }
  })
);

const secondaryTileStyles = memoizeFunction(
  (orientation: _TileOrientation): VideoTileStylesProps => ({
    root: {
      borderRadius: '0.25rem',
      height: orientation === 'landscape' ? '1.625rem' : '2rem',
      width: orientation === 'landscape' ? '2rem' : '1.625rem'
    }
  })
);
