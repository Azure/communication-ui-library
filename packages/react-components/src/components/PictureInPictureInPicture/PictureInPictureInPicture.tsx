// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { ReactChild } from 'react';
import {
  PictureInPictureInPicturePrimaryTile,
  PictureInPictureInPictureSecondaryTile,
  _PictureInPictureInPictureTileProps
} from './PictureInPictureInPictureTile';

/**
 * Props for {@link _PictureInPictureInPicture} component.
 *
 * @internal
 */
export interface _PictureInPictureInPictureProps {
  /**
   * Callback when the {@link _PictureInPictureInPicture} is clicked.
   */
  onClick?: () => void;

  primaryTile: _PictureInPictureInPictureTileProps;
  secondaryTile: _PictureInPictureInPictureTileProps;
}

/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE WHEN PROPS USED (BELOW)
/**
 * Component that displays a video feed for use as a Picture-in-Picture style component.
 * It contains a secondary video feed resulting in an inner Picture-in-Picture style feed.
 *
 * @remarks
 * The double nature of the Picture-in-Picture styles is where this component gets its name; Picture-in-Picture-in-Picture.
 *
 * @internal
 */
export const _PictureInPictureInPicture = (props: _PictureInPictureInPictureProps): JSX.Element => {
  return (
    <PictureInPictureInPictureContainer
      primaryView={<PictureInPictureInPicturePrimaryTile {...props.primaryTile} />}
      secondaryView={<PictureInPictureInPictureSecondaryTile {...props.secondaryTile} />}
    />
  );
};
/**
 * Container for the picture in picture in picture component.
 * This governs positioning and floating of the secondary PiP.
 */
const PictureInPictureInPictureContainer = (props: {
  primaryView: ReactChild;
  secondaryView: ReactChild;
  onClick?: () => void;
}): JSX.Element => (
  <div style={tileContainerStyles} onClick={props.onClick}>
    {props.primaryView}
    <div style={secondaryTileFloatingStyles}>{props.secondaryView}</div>
  </div>
);

const tileContainerStyles: React.CSSProperties = {
  position: 'relative'
};

const secondaryTileFloatingStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '0.125rem',
  right: '0.125rem'
};
