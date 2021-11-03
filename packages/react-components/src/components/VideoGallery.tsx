// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions, Modal, Stack } from '@fluentui/react';
import React, { useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../gallery';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useTheme } from '../theming';
import { BaseCustomStyles, VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../types';
import { GridLayout } from './GridLayout';
import { ResponsiveHorizontalGallery } from './ResponsiveHorizontalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import {
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  gridStyle,
  horizontalGalleryStyle,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  LARGE_HORIZONTAL_GALLERY_TILE_STYLE,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_STYLE,
  videoGalleryContainerStyle,
  videoGalleryOuterDivStyle
} from './styles/VideoGallery.styles';
import { isNarrowWidth, useContainerWidth } from './utils/responsive';

const emptyStyles = {};
const FLOATING_TILE_HOST_ID = 'UILibraryFloatingTileHost';

// Currently the Calling JS SDK supports up to 4 remote video streams
const MAX_VIDEO_PARTICIPANTS_TILES = 4;
// Set aside only 6 dominant speakers for remaining audio participants
const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * All strings that may be shown on the UI in the {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryStrings {
  /** String to notify that local user is sharing their screen */
  screenIsBeingSharedMessage: string;
  /** String to show when remote screen share stream is loading */
  screenShareLoadingMessage: string;
}

/**
 * Props for {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <VideoGallery styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: BaseCustomStyles;
  /** Layout of the video tiles. */
  layout?: 'default' | 'floatingLocalVideo';
  /** Local video particpant */
  localParticipant: VideoGalleryLocalParticipant;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Callback to render participants in VideoGallery */
  onRenderTile: (
    props: VideoGalleryLocalParticipant | VideoGalleryRemoteParticipant,
    type: 'participant' | 'screenshare' | 'localParticipant' | 'localScreenshare'
  ) => JSX.Element;
  /** Optional strings to override in component  */
  strings?: Partial<VideoGalleryStrings>;
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

/**
 * VideoGallery represents a {@link GridLayout} of video tiles for a specific call.
 * It displays a {@link VideoTile} for the local user as well as for each remote participants who joined the call.
 *
 * @public
 */
export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const { localParticipant, remoteParticipants = [], dominantSpeakers, styles, layout, onRenderTile } = props;

  const ids = useIdentifiers();
  const theme = useTheme();

  const shouldFloatLocalVideo = !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isNarrow = isNarrowWidth(containerWidth);
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: MAX_VIDEO_PARTICIPANTS_TILES
  }).slice(0, MAX_VIDEO_PARTICIPANTS_TILES);

  // This set will be used to filter out participants already in visibleVideoParticipants
  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));
  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => !visibleVideoParticipantsSet.has(p.userId)) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: MAX_AUDIO_DOMINANT_SPEAKERS
  });

  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);

  let gridParticipants: VideoGalleryRemoteParticipant[] = [];
  let horizontalGalleryParticipants: VideoGalleryRemoteParticipant[] = [];

  const screenShareActive = screenShareParticipant || localParticipant?.isScreenSharingOn;
  if (!screenShareActive) {
    // If screen sharing is not active then assign all visible video participants as grid participants.
    // If there no visible participants then assign audio participants as grid participants.
    gridParticipants =
      visibleVideoParticipants.current.length > 0 ? visibleVideoParticipants.current : visibleAudioParticipants.current;
    horizontalGalleryParticipants = visibleVideoParticipants.current.length > 0 ? visibleAudioParticipants.current : [];
  } else {
    // If screen sharing is active, assign video and audio participants as horizontal gallery participants
    horizontalGalleryParticipants = visibleVideoParticipants.current.concat(visibleAudioParticipants.current);
  }

  const localVideoTile = (
    <Stack className={floatingLocalVideoTileStyle(theme)}>{onRenderTile(localParticipant, 'localParticipant')}</Stack>
  );

  const gridTiles = gridParticipants.map((participant, i): JSX.Element => {
    return <Stack key={`grid-tile-${i}`}>{onRenderTile(participant, 'participant')}</Stack>;
  });

  if (!shouldFloatLocalVideo && localParticipant) {
    gridTiles.push(
      <Stack
        key="grid-tile-local"
        data-ui-id={ids.videoGallery}
        horizontalAlign="center"
        verticalAlign="center"
        className={gridStyle}
        grow
      >
        {localParticipant && localVideoTile}
      </Stack>
    );
  }
  const horizontalGalleryTiles = horizontalGalleryParticipants.map((participant, i): JSX.Element => {
    return (
      <Stack
        key={`horizontal-gallery-tile-${i}`}
        style={isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_HORIZONTAL_GALLERY_TILE_STYLE}
      >
        {onRenderTile(participant, 'participant')}
      </Stack>
    );
  });

  const localScreenShareStreamComponent = localParticipant?.isScreenSharingOn
    ? onRenderTile(localParticipant, 'localScreenshare')
    : null;

  const remoteScreenShareComponent = screenShareParticipant
    ? onRenderTile(screenShareParticipant, 'screenshare')
    : null;

  return (
    <div id={FLOATING_TILE_HOST_ID} ref={containerRef} className={videoGalleryOuterDivStyle}>
      {shouldFloatLocalVideo && (
        <Modal
          isOpen={true}
          isModeless={true}
          dragOptions={DRAG_OPTIONS}
          styles={floatingLocalVideoModalStyle(theme, isNarrow)}
          layerProps={{ hostId: FLOATING_TILE_HOST_ID }}
        >
          {localParticipant && localVideoTile}
        </Modal>
      )}
      <Stack styles={videoGalleryContainerStyle}>
        {remoteScreenShareComponent ? (
          remoteScreenShareComponent
        ) : localScreenShareStreamComponent ? (
          localScreenShareStreamComponent
        ) : (
          <GridLayout styles={styles ?? emptyStyles}>{gridTiles}</GridLayout>
        )}
        {horizontalGalleryParticipants && horizontalGalleryParticipants.length > 0 && (
          <ResponsiveHorizontalGallery
            containerStyles={horizontalGalleryStyle(shouldFloatLocalVideo, isNarrow)}
            childWidthRem={
              isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
            }
            buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
            gapWidthRem={HORIZONTAL_GALLERY_GAP}
          >
            {horizontalGalleryTiles}
          </ResponsiveHorizontalGallery>
        )}
      </Stack>
    </div>
  );
};
