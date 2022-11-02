// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, concatStyleSets } from '@fluentui/react';
import React from 'react';
import { VideoGalleryLocalParticipant } from '../../types';
import { GridLayout } from '../GridLayout';
import { _ICoordinates } from '../ModalClone/ModalClone';
import { ResponsiveHorizontalGallery } from '../ResponsiveHorizontalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
import {
  videoGalleryContainerStyle,
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM
} from '../styles/VideoGallery.styles';
import { VideoGalleryStyles } from '../VideoGallery';
import { LocalScreenShare } from './LocalScreenShare';
import { _LocalVideoTileLayout } from './LocalVideoTileLayout';

/**
 * @private
 */
export interface _FloatingLocalVideoLayoutProps {
  shouldFloatLocalVideo: boolean;
  shouldFloatNonDraggableLocalVideo: boolean;
  horizontalGalleryPresent: boolean;
  localVideoTile?: JSX.Element;
  isNarrow: boolean;
  layerHostId: string;
  modalMaxDragPosition?: _ICoordinates;
  modalMinDragPosition?: _ICoordinates;
  remoteParticipantsLength: number;
  remoteScreenShareComponent?: JSX.Element;
  localParticipant: VideoGalleryLocalParticipant;
  videoTiles: JSX.Element[];
  audioTiles: JSX.Element[];
  callingTiles: JSX.Element[];
  styles?: VideoGalleryStyles;
}

/**
 * @private
 */
export const _FloatingLocalVideoLayout = (props: _FloatingLocalVideoLayoutProps): JSX.Element => {
  const {
    shouldFloatLocalVideo,
    shouldFloatNonDraggableLocalVideo,
    localVideoTile,
    horizontalGalleryPresent,
    isNarrow,
    layerHostId,
    modalMaxDragPosition,
    modalMinDragPosition,
    remoteParticipantsLength,
    remoteScreenShareComponent,
    localParticipant,
    videoTiles,
    audioTiles,
    callingTiles,
    styles
  } = props;

  const createGridTiles = (): JSX.Element[] => {
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    return videoTiles.length > 0 ? videoTiles : audioTiles.concat(callingTiles);
    return videoTiles.length > 0 ? videoTiles : audioTiles;
  };
  const gridTiles = createGridTiles();

  const createHorizontalGalleryTiles = (): JSX.Element[] => {
    if (remoteScreenShareComponent || localParticipant.isScreenSharingOn) {
      // If screen sharing is active, assign video and audio participants as horizontal gallery participants
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return videoTiles.concat(audioTiles.concat(callingTiles));
      return videoTiles.concat(audioTiles);
    } else {
      // If screen sharing is not active, then assign all video tiles as grid tiles.
      // If there are no video tiles, then assign audio tiles as grid tiles.
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return videoTiles.length > 0 ? audioTiles.concat(callingTiles) : [];
      return videoTiles.length > 0 ? audioTiles : [];
    }
  };
  const horizontalGalleryTiles = createHorizontalGalleryTiles();

  return (
    <>
      <_LocalVideoTileLayout
        shouldFloatLocalVideo={shouldFloatLocalVideo}
        shouldFloatNonDraggableLocalVideo={shouldFloatNonDraggableLocalVideo}
        horizontalGalleryPresent={horizontalGalleryPresent}
        localVideoTile={localVideoTile}
        isNarrow={isNarrow}
        layerHostId={layerHostId}
        modalMaxDragPosition={modalMaxDragPosition}
        modalMinDragPosition={modalMinDragPosition}
        remoteParticipantsLength={remoteParticipantsLength}
      />
      <Stack horizontal={false} styles={videoGalleryContainerStyle}>
        {remoteScreenShareComponent ? (
          remoteScreenShareComponent
        ) : localParticipant.isScreenSharingOn ? (
          <LocalScreenShare localParticipant={localParticipant} />
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {horizontalGalleryPresent && (
          <div style={{ paddingTop: '0.5rem' }}>
            <ResponsiveHorizontalGallery
              key="responsive-horizontal-gallery"
              containerStyles={horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow)}
              horizontalGalleryStyles={concatStyleSets(horizontalGalleryStyle(isNarrow), styles?.horizontalGallery)}
              childWidthRem={
                isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
              }
              buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
              gapWidthRem={HORIZONTAL_GALLERY_GAP}
            >
              {horizontalGalleryTiles}
            </ResponsiveHorizontalGallery>
          </div>
        )}
      </Stack>
    </>
  );
};
