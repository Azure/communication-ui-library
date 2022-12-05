// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions, LayerHost, mergeStyles, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useMemo } from 'react';
import { GridLayoutStyles } from '..';
import { useTheme } from '../../theming';
import { BaseCustomStyles, VideoGalleryRemoteParticipant } from '../../types';
import { GridLayout } from '../GridLayout';
import { HorizontalGalleryStyles } from '../HorizontalGallery';
import { _ICoordinates, _ModalClone } from '../ModalClone/ModalClone';
import {
  floatingLocalVideoModalStyle,
  LARGE_FLOATING_MODAL_SIZE_PX,
  layerHostStyle,
  localVideoTileContainerStyle,
  localVideoTileOuterPaddingPX,
  localVideoTileWithControlsContainerStyle,
  LOCAL_VIDEO_TILE_ZINDEX,
  SMALL_FLOATING_MODAL_SIZE_PX
} from '../styles/VideoGallery.styles';
import { isNarrowWidth } from '../utils/responsive';
import { VideoGalleryStyles } from '../VideoGallery';
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
import { VideoGalleryResponsiveHorizontalGallery } from './VideoGalleryResponsiveHorizontalGallery';
import { useFloatingLocalVideoLayout } from './videoGalleryUtils';

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
export interface FloatingLocalVideoLayoutProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <VideoGallery styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: VideoGalleryStyles;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** Callback to render each remote participant */
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Component that contains local video content */
  localVideoComponent?: JSX.Element;
  /** Component that contains screen share content */
  screenShareComponent?: JSX.Element;
  /**
   * Maximum number of participant remote video streams that is rendered.
   * @defaultValue 4
   */
  maxRemoteVideoStreams?: number;
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Width of parent element
   */
  parentWidth?: number;
  /**
   * Height of parent element
   */
  parentHeight?: number;
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

// Manually override the max position used to keep the modal in the bounds of its container.
// This is a workaround for: https://github.com/microsoft/fluentui/issues/20122
// Because our modal starts in the bottom right corner, we can say that this is the max (i.e. rightmost and bottomost)
// position the modal can be dragged to.
const modalMaxDragPosition = { x: localVideoTileOuterPaddingPX, y: localVideoTileOuterPaddingPX };

/**
 * FloatingLocalVideoLayout displays remote participants and a screen sharing component in
 * a grid and horizontal gallery while floating the local video
 *
 * @private
 */
export const FloatingLocalVideoLayout = (props: FloatingLocalVideoLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    showCameraSwitcherInLocalPreview,
    parentWidth,
    parentHeight
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const floatingLocalVideoLayout = useFloatingLocalVideoLayout({
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent
  });

  let activeVideoStreams = 0;

  const shouldFloatLocalVideo = floatingLocalVideoLayout.gridParticipants.length > 0;
  const shouldFloatNonDraggableLocalVideo = !!(showCameraSwitcherInLocalPreview && shouldFloatLocalVideo);

  const gridTiles = floatingLocalVideoLayout.gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  if (!shouldFloatLocalVideo && localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  const horizontalGalleryTiles = floatingLocalVideoLayout.horizontalGalleryParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const layerHostId = useId('layerhost');

  return (
    <Stack styles={{ root: { position: 'relative', width: '100%', height: '100%' } }}>
      {!shouldFloatNonDraggableLocalVideo &&
        localVideoComponent &&
        (horizontalGalleryTiles.length > 0 ? (
          <Stack className={mergeStyles(localVideoTileContainerStyle(theme, isNarrow))}>{localVideoComponent}</Stack>
        ) : (
          <FloatingLocalVideo
            localVideoComponent={localVideoComponent}
            layerHostId={layerHostId}
            isNarrow={isNarrow}
            parentWidth={parentWidth}
            parentHeight={parentHeight}
          />
        ))}
      {
        // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
        shouldFloatNonDraggableLocalVideo && localVideoComponent && gridTiles.length > 0 && (
          <Stack
            className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, isNarrow), {
              boxShadow: theme.effects.elevation8,
              zIndex: LOCAL_VIDEO_TILE_ZINDEX
            })}
          >
            {localVideoComponent}
          </Stack>
        )
      }
      <Stack horizontal={false} styles={rootLayoutStyle}>
        {screenShareComponent ? (
          screenShareComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {horizontalGalleryTiles.length > 0 && (
          <VideoGalleryResponsiveHorizontalGallery
            isNarrow={isNarrow}
            shouldFloatLocalVideo={true}
            horizontalGalleryElements={horizontalGalleryTiles}
            styles={styles?.horizontalGallery}
          />
        )}
        <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      </Stack>
    </Stack>
  );
};

const FloatingLocalVideo = (props: {
  localVideoComponent: JSX.Element;
  layerHostId: string;
  isNarrow?: boolean;
  parentWidth?: number;
  parentHeight?: number;
}): JSX.Element => {
  const { localVideoComponent, layerHostId, isNarrow, parentWidth, parentHeight } = props;

  const theme = useTheme();

  const modalWidth = isNarrow ? SMALL_FLOATING_MODAL_SIZE_PX.width : LARGE_FLOATING_MODAL_SIZE_PX.width;
  const modalHeight = isNarrow ? SMALL_FLOATING_MODAL_SIZE_PX.height : LARGE_FLOATING_MODAL_SIZE_PX.height;
  // The minimum drag position is the top left of the video gallery. i.e. the modal (PiP) should not be able
  // to be dragged offscreen and these are the top and left bounds of that calculation.
  const modalMinDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      parentWidth && parentHeight
        ? {
            // We use -parentWidth/Height because our modal is positioned to start in the bottom right,
            // hence (0,0) is the bottom right of the video gallery.
            x: -parentWidth + modalWidth + localVideoTileOuterPaddingPX,
            y: -parentHeight + modalHeight + localVideoTileOuterPaddingPX
          }
        : undefined,
    [parentHeight, parentWidth, modalHeight, modalWidth]
  );

  return (
    <_ModalClone
      isOpen={true}
      isModeless={true}
      dragOptions={DRAG_OPTIONS}
      styles={floatingLocalVideoModalStyle(theme, isNarrow)}
      layerProps={{ hostId: layerHostId }}
      maxDragPosition={modalMaxDragPosition}
      minDragPosition={modalMinDragPosition}
    >
      {localVideoComponent}
    </_ModalClone>
  );
};
