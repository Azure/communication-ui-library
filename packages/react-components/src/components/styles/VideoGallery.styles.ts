// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  mergeStyles,
  IStackStyles,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject,
  Theme,
  IStyle
} from '@fluentui/react';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { VideoTileStylesProps } from '../VideoTile';

const videoBaseStyle = mergeStyles({
  border: 0
});

/**
 * @private
 */
export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

/**
 * @private
 */
export const videoGalleryOuterDivStyle = mergeStyles({ position: 'relative', width: '100%', height: '100%' });

/**
 * @private
 */
export const videoGalleryContainerStyle: IStackStyles = { root: { position: 'relative', height: '100%' } };

/**
 * Large floating modal width and height for small screen
 */
export const SMALL_FLOATING_MODAL_SIZE = { width: 4, height: 5.5 }; //size in rem

/**
 * Large floating modal width and height for large screen
 */
export const LARGE_FLOATING_MODAL_SIZE = { width: 10, height: 7.5 };

/**
 * @private
 */
export const floatingLocalVideoModalStyle = (
  theme: Theme,
  isNarrow?: boolean
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  main: {
    minWidth: isNarrow ? `${SMALL_FLOATING_MODAL_SIZE.width}rem` : `${LARGE_FLOATING_MODAL_SIZE.width}rem`,
    minHeight: isNarrow ? `${SMALL_FLOATING_MODAL_SIZE.height}rem` : `${LARGE_FLOATING_MODAL_SIZE.height}rem`,
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    boxShadow: theme.effects.elevation8,
    borderRadius: theme.effects.roundedCorner4
  }
});

/**
 * @private
 */
export const floatingLocalVideoTileStyle: VideoTileStylesProps = {
  root: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%'
  }
};

/**
 * @private
 */
export const videoWithNoRoundedBorderStyle = {
  root: {
    '& video': { borderRadius: '0rem' }
  }
};

/**
 * @private
 */
export const horizontalGalleryStyle = (isNarrow: boolean): IStyle => {
  return {
    height: isNarrow ? '6rem' : '8rem',
    width: isNarrow
      ? `calc(100% - ${SMALL_FLOATING_MODAL_SIZE.width}rem)`
      : `calc(100% - ${LARGE_FLOATING_MODAL_SIZE.width}rem)`,
    marginRight: '0.5rem',
    marginLeft: '0.5rem'
  };
};

/**
 * Small horizontal gallery tile size in rem
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_SIZE = { height: 5.5, width: 5.5 };
/**
 * Large horizontal gallery tile size in rem
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_SIZE = { height: 7.5, width: 10 };

/**
 * @private
 */
export const SMALL_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  minWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`,
  maxHeight: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  maxWidth: `${SMALL_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`
};
/**
 * @private
 */
export const LARGE_HORIZONTAL_GALLERY_TILE_STYLE = {
  minHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  minWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`,
  maxHeight: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.height}rem`,
  maxWidth: `${LARGE_HORIZONTAL_GALLERY_TILE_SIZE.width}rem`
};
