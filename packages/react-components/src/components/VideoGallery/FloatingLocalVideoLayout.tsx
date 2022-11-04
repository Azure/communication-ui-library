// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, LayerHost, mergeStyles, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../../gallery';
import {
  CreateVideoStreamViewResult,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../../types';
import { GridLayout } from '../GridLayout';
import { _ICoordinates } from '../ModalClone/ModalClone';
import { ResponsiveHorizontalGallery } from '../ResponsiveHorizontalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from '../styles/HorizontalGallery.styles';
import {
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  layerHostStyle,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  videoGalleryContainerStyle
} from '../styles/VideoGallery.styles';
import { VideoGalleryStyles } from '../VideoGallery';
import { LocalScreenShare } from './LocalScreenShare';
import { _FloatingLocalVideoTile } from './FloatingLocalVideoTile';
import { RemoteScreenShare } from './RemoteScreenShare';

// Currently the Calling JS SDK supports up to 4 remote video streams
const DEFAULT_MAX_REMOTE_VIDEO_STREAMS = 4;
// Set aside only 6 dominant speakers for remaining audio participants
const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * @private
 */
export interface _FloatingLocalVideoLayoutProps {
  shouldFloatLocalVideo: boolean;
  shouldFloatNonDraggableLocalVideo: boolean;
  localVideoTile?: JSX.Element;
  isNarrow: boolean;
  modalMaxDragPosition?: _ICoordinates;
  modalMinDragPosition?: _ICoordinates;
  localParticipant: VideoGalleryLocalParticipant;
  styles?: VideoGalleryStyles;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  maxRemoteVideoStreams?: number;
  defaultOnRenderVideoTile: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  onCreateRemoteStreamView?: (
    userId: string,
    options?: VideoStreamOptions
  ) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to render a remote video tile */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
}

/**
 * @private
 */
export const _FloatingLocalVideoLayout = (props: _FloatingLocalVideoLayoutProps): JSX.Element => {
  const {
    shouldFloatLocalVideo,
    shouldFloatNonDraggableLocalVideo,
    localVideoTile,
    isNarrow,
    modalMaxDragPosition,
    modalMinDragPosition,
    localParticipant,
    styles,
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEO_STREAMS,
    onRenderRemoteVideoTile,
    defaultOnRenderVideoTile,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView
  } = props;

  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const visibleCallingParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: maxRemoteVideoStreams
  }).slice(0, maxRemoteVideoStreams);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  visibleCallingParticipants.current = remoteParticipants?.filter((p) => p.state === ('Connecting' || 'Ringing')) ?? [];

  // This set will be used to filter out participants already in visibleVideoParticipants
  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const visibleCallingParticipantsSet = new Set(visibleCallingParticipants.current.map((p) => p.userId));

  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants:
      remoteParticipants?.filter(
        (p) =>
          !visibleVideoParticipantsSet.has(p.userId) &&
          /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !visibleCallingParticipantsSet.has(
            p.userId
          )
      ) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: MAX_AUDIO_DOMINANT_SPEAKERS
  });

  const videoTiles = onRenderRemoteVideoTile
    ? visibleVideoParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleVideoParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, true);
      });

  const audioTiles = onRenderRemoteVideoTile
    ? visibleAudioParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleAudioParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, false);
      });

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingTiles = onRenderRemoteVideoTile
    ? visibleCallingParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleCallingParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, false);
      });
  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);
  const screenShareActive = screenShareParticipant || localParticipant?.isScreenSharingOn;

  const createGridTiles = (): JSX.Element[] => {
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    return videoTiles.length > 0 ? videoTiles : audioTiles.concat(callingTiles);
    return videoTiles.length > 0 ? videoTiles : audioTiles;
  };
  const gridTiles = createGridTiles();

  const createHorizontalGalleryTiles = (): JSX.Element[] => {
    if (screenShareActive) {
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
  const horizontalGalleryPresent = horizontalGalleryTiles && horizontalGalleryTiles.length > 0;

  const layerHostId = useId('layerhost');

  const remoteScreenShareComponent = screenShareParticipant && (
    <RemoteScreenShare
      {...screenShareParticipant}
      renderElement={screenShareParticipant.screenShareStream?.renderElement}
      onCreateRemoteStreamView={onCreateRemoteStreamView}
      onDisposeRemoteStreamView={onDisposeRemoteStreamView}
      isReceiving={screenShareParticipant.screenShareStream?.isReceiving}
    />
  );

  return (
    <>
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      <_FloatingLocalVideoTile
        shouldFloatLocalVideo={shouldFloatLocalVideo}
        shouldFloatNonDraggableLocalVideo={shouldFloatNonDraggableLocalVideo}
        horizontalGalleryPresent={horizontalGalleryPresent}
        localVideoTile={localVideoTile}
        isNarrow={isNarrow}
        layerHostId={layerHostId}
        modalMaxDragPosition={modalMaxDragPosition}
        modalMinDragPosition={modalMinDragPosition}
        remoteParticipantsLength={remoteParticipants.length}
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
