// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  _PictureInPictureInPicture,
  _PictureInPictureInPictureProps,
  _TileOrientation
} from '@internal/react-components';
import React from 'react';

interface PictureInPictureInPictureWrapperProps extends _PictureInPictureInPictureProps {
  primaryTile: {
    orientation: _TileOrientation;
    getTile: () => JSX.Element;
  };
  secondaryTile?: {
    orientation: _TileOrientation;
    getTile: () => JSX.Element;
  };
}

// Note: This component is wrapping  _PictureInPictureInPicture to remap the props `primaryTile` and `secondaryTile`
// because they do not work in storybook v6.5.7 and causes the story page will timeout.
// For some reason, the ReactNode type prop `children` of Object type props `primaryTile` and `secondaryTile` are causing issues.
export const PictureInPictureInPictureWrapper = (props: PictureInPictureInPictureWrapperProps): JSX.Element => {
  return (
    <_PictureInPictureInPicture
      {...props}
      primaryTile={{
        orientation: props.primaryTile.orientation,
        children: props.primaryTile.getTile()
      }}
      secondaryTile={
        props.secondaryTile
          ? {
              orientation: props.secondaryTile.orientation,
              children: props.secondaryTile.getTile()
            }
          : undefined
      }
    />
  );
};
