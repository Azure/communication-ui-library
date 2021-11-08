// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, ContextualMenu, IDragOptions, Modal, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../gallery';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useTheme } from '../theming';
import {
  BaseCustomStyles,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { RemoteVideoTile } from './RemoteVideoTile';
import { ResponsiveHorizontalGallery } from './ResponsiveHorizontalGallery';
import { StreamMedia } from './StreamMedia';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import {
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  videoGalleryContainerStyle,
  videoGalleryOuterDivStyle
} from './styles/VideoGallery.styles';
import { isNarrowWidth, useContainerWidth } from './utils/responsive';
import { LocalScreenShare } from './VideoGallery/LocalScreenShare';
import { RemoteScreenShare } from './VideoGallery/RemoteScreenShare';
import { VideoTile } from './VideoTile';

const emptyStyles = {};
const FLOATING_TILE_HOST_ID = 'UILibraryFloatingTileHost';

// Currently the Calling JS SDK supports up to 4 remote video streams
const DEFAULT_MAX_REMOTE_VIDEO_STREAMS = 4;
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
  /** Local video view options */
  localVideoViewOption?: VideoStreamOptions;
  /** Remote videos view options */
  remoteVideoViewOption?: VideoStreamOptions;
  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to render the local video tile*/
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to render a particpant avatar */
  onRenderAvatar?: OnRenderAvatarCallback;

  /**
   * Whether to display a mute icon beside the user's display name.
   * @defaultValue `true`
   */
  showMuteIndicator?: boolean;
  /** Optional strings to override in component  */
  strings?: Partial<VideoGalleryStrings>;
  /**
   * Maximum number of participant remote video streams that is rendered.
   * @defaultValue 4
   */
  maxRemoteVideoStreams?: number;
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
  const {
    localParticipant,
    remoteParticipants = [],
    localVideoViewOption,
    remoteVideoViewOption,
    dominantSpeakers,
    onRenderLocalVideoTile,
    onRenderRemoteVideoTile,
    onCreateLocalStreamView,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    styles,
    layout,
    onRenderAvatar,
    showMuteIndicator,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEO_STREAMS
  } = props;

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
    maxDominantSpeakers: maxRemoteVideoStreams
  }).slice(0, maxRemoteVideoStreams);

  // This set will be used to filter out participants already in visibleVideoParticipants
  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));
  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => !visibleVideoParticipantsSet.has(p.userId)) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: MAX_AUDIO_DOMINANT_SPEAKERS
  });

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const localVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    const localVideoTileStyles = shouldFloatLocalVideo ? floatingLocalVideoTileStyle : {};

    const localVideoTileStylesThemed = concatStyleSets(localVideoTileStyles, {
      root: { borderRadius: theme.effects.roundedCorner4 }
    });

    if (localVideoStream && !localVideoStream.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
    }

    return (
      <VideoTile
        key={localParticipant.userId}
        userId={localParticipant.userId}
        renderElement={
          localVideoStream?.renderElement ? (
            <StreamMedia videoStreamElement={localVideoStream.renderElement} />
          ) : undefined
        }
        showLabel={!isNarrow}
        displayName={localParticipant?.displayName}
        styles={localVideoTileStylesThemed}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={localParticipant.isMuted}
        showMuteIndicator={showMuteIndicator}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localParticipant,
    localParticipant.isScreenSharingOn,
    localParticipant.videoStream,
    localParticipant.videoStream?.renderElement,
    isNarrow,
    onCreateLocalStreamView,
    onRenderLocalVideoTile,
    onRenderAvatar,
    shouldFloatLocalVideo
  ]);

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => {
      const remoteVideoStream = participant.videoStream;
      return (
        <RemoteVideoTile
          key={participant.userId}
          userId={participant.userId}
          onCreateRemoteStreamView={isVideoParticipant ? onCreateRemoteStreamView : undefined}
          onDisposeRemoteStreamView={isVideoParticipant ? onDisposeRemoteStreamView : undefined}
          isAvailable={isVideoParticipant ? remoteVideoStream?.isAvailable : false}
          renderElement={isVideoParticipant ? remoteVideoStream?.renderElement : undefined}
          remoteVideoViewOption={isVideoParticipant ? remoteVideoViewOption : undefined}
          isMuted={participant.isMuted}
          isSpeaking={participant.isSpeaking}
          displayName={participant.displayName}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
        />
      );
    },
    [onCreateRemoteStreamView, onDisposeRemoteStreamView, remoteVideoViewOption, onRenderAvatar, showMuteIndicator]
  );

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

  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);
  const screenShareActive = screenShareParticipant || localParticipant?.isScreenSharingOn;

  let gridTiles: JSX.Element[] = [];
  let horizontalGalleryTiles: JSX.Element[] = [];

  if (screenShareActive) {
    // If screen sharing is active, assign video and audio participants as horizontal gallery participants
    horizontalGalleryTiles = videoTiles.concat(audioTiles);
  } else {
    // If screen sharing is not active, then assign all video tiles as grid tiles.
    // If there are no video tiles, then assign audio tiles as grid tiles.
    gridTiles = videoTiles.length > 0 ? videoTiles : audioTiles;
    horizontalGalleryTiles = videoTiles.length > 0 ? audioTiles : [];
  }

  if (!shouldFloatLocalVideo && localParticipant) {
    gridTiles.push(localVideoTile);
  }

  const localScreenShareStreamComponent = <LocalScreenShare localParticipant={localParticipant} />;

  const remoteScreenShareComponent = (
    <RemoteScreenShare
      screenShareParticipant={screenShareParticipant}
      onCreateRemoteStreamView={onCreateRemoteStreamView}
    />
  );

  return (
    <div
      id={FLOATING_TILE_HOST_ID}
      data-ui-id={ids.videoGallery}
      ref={containerRef}
      className={videoGalleryOuterDivStyle}
    >
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
        {screenShareParticipant ? (
          remoteScreenShareComponent
        ) : localParticipant?.isScreenSharingOn ? (
          localScreenShareStreamComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles ?? emptyStyles}>
            {gridTiles}
          </GridLayout>
        )}
        {horizontalGalleryTiles && horizontalGalleryTiles.length > 0 && (
          <ResponsiveHorizontalGallery
            key="responsive-horizontal-gallery"
            containerStyles={horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow)}
            horizontalGalleryStyles={horizontalGalleryStyle(isNarrow)}
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
