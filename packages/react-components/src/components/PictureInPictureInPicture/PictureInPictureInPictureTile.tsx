// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, memoizeFunction, Stack } from '@fluentui/react';
import React, { ReactChild } from 'react';
import { useTheme } from '../../theming/FluentThemeProvider';

/** @internal */
export type _TileOrientation = 'portrait' | 'landscape';

/** @internal */
export interface _PictureInPictureInPictureTileProps {
  content: ReactChild;
  orientation: _TileOrientation;
}

/** @private */
export const PictureInPictureInPicturePrimaryTile = (props: _PictureInPictureInPictureTileProps): JSX.Element => {
  const boxShadow = useTheme().effects.elevation8;
  return (
    <PictureInPictureInPictureTile content={props.content} styles={primaryTileStyles(props.orientation, boxShadow)} />
  );
};

/** @private */
export const PictureInPictureInPictureSecondaryTile = (props: _PictureInPictureInPictureTileProps): JSX.Element => (
  <PictureInPictureInPictureTile content={props.content} styles={secondaryTileStyles(props.orientation)} />
);

const PictureInPictureInPictureTile = (props: { styles: IStackStyles; content: ReactChild }): JSX.Element => (
  <Stack styles={props.styles}>{props.content}</Stack>
);

const primaryTileStyles = memoizeFunction(
  (orientation: _TileOrientation, themeElevation: string): IStackStyles => ({
    root: {
      borderRadius: '0.25rem',
      height: orientation === 'landscape' ? '5.5rem' : '8rem',
      width: orientation === 'landscape' ? '8rem' : '5.5rem',
      boxShadow: themeElevation,
      // PiPiP tiles were not designed to host scrollable content. If removed check no scrollbar is showing in e2e tests
      overflow: 'hidden'
    }
  })
);

const secondaryTileStyles = memoizeFunction(
  (orientation: _TileOrientation): IStackStyles => ({
    root: {
      borderRadius: '0.25rem',
      height: orientation === 'landscape' ? '1.625rem' : '2rem',
      width: orientation === 'landscape' ? '2rem' : '1.625rem',
      // PiPiP tiles were not designed to host scrollable content. If removed check no scrollbar is showing in e2e tests
      overflow: 'hidden'
    }
  })
);
