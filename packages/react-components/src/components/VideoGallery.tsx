// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions, Modal, Stack, concatStyleSets } from '@fluentui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../gallery';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useTheme } from '../theming';
import {
  BaseCustomStylesProps,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import {
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  gridStyle,
  videoGalleryContainerStyle,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE,
  SMALL_HORIZONTAL_GALLERY_TILE_STYLE,
  LARGE_HORIZONTAL_GALLERY_TILE_STYLE,
  horizontalGalleryStyle,
  videoGalleryOuterDivStyle
} from './styles/VideoGallery.styles';
import { VideoTile } from './VideoTile';
import { RemoteVideoTile } from './RemoteVideoTile';
import { useContainerWidth, isNarrowWidth } from './utils/responsive';
import { SmartHorizontalGallery } from './SmartHorizontalGallery';

const emptyStyles = {};
const floatingTileHostId = 'UILibraryFloatingTileHost';

// Currently the Calling JS SDK supports up to 4 remote video streams
const MAX_VIDEO_PARTICIPANTS_TILES = 4;
// Set aside only 6 dominant speakers for remaining audio participants
const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

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
  styles?: BaseCustomStylesProps;
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
    showMuteIndicator
  } = props;

  const ids = useIdentifiers();
  const theme = useTheme();

  const shouldFloatLocalVideo = useMemo((): boolean => {
    return !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);
  }, [layout, remoteParticipants.length]);

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

  // If there are no video participants, we assign all audio participants as grid participants and assign
  // an empty array as horizontal gallery partipants to avoid rendering the horizontal gallery.
  const gridParticipants =
    visibleVideoParticipants.current.length > 0 ? visibleVideoParticipants.current : visibleAudioParticipants.current;
  const horizontalGalleryParticipants =
    visibleVideoParticipants.current.length > 0 ? visibleAudioParticipants.current : [];

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
        userId={localParticipant.userId}
        renderElement={
          localVideoStream?.renderElement ? (
            <StreamMedia videoStreamElement={localVideoStream.renderElement} />
          ) : undefined
        }
        displayName={localParticipant?.displayName}
        styles={localVideoTileStylesThemed}
        onRenderPlaceholder={localParticipant.isScreenSharingOn ? () => <></> : onRenderAvatar}
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
    onCreateLocalStreamView,
    onRenderLocalVideoTile,
    onRenderAvatar,
    shouldFloatLocalVideo
  ]);

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, isVideoParticipant: boolean) => {
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

  const gridTiles = onRenderRemoteVideoTile
    ? gridParticipants.map((participant) => onRenderRemoteVideoTile(participant))
    : gridParticipants.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, true);
      });

  if (!shouldFloatLocalVideo && localParticipant) {
    gridTiles.push(
      <Stack data-ui-id={ids.videoGallery} horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && localVideoTile}
      </Stack>
    );
  }

  const horizontalGalleryTiles = onRenderRemoteVideoTile
    ? horizontalGalleryParticipants.map((participant) => onRenderRemoteVideoTile(participant))
    : horizontalGalleryParticipants.map((participant): JSX.Element => {
        return (
          <div
            key={participant.userId}
            style={isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_HORIZONTAL_GALLERY_TILE_STYLE}
          >
            {defaultOnRenderVideoTile(participant, shouldFloatLocalVideo)}
          </div>
        );
      });

  return (
    <div ref={containerRef} className={videoGalleryOuterDivStyle}>
      <Stack id={floatingTileHostId} grow styles={videoGalleryContainerStyle}>
        {shouldFloatLocalVideo && (
          <Modal
            isOpen={true}
            isModeless={true}
            dragOptions={DRAG_OPTIONS}
            styles={floatingLocalVideoModalStyle(theme, isNarrow)}
            layerProps={{ hostId: floatingTileHostId }}
          >
            {localParticipant && localVideoTile}
          </Modal>
        )}
        <GridLayout styles={styles ?? emptyStyles}>{gridTiles}</GridLayout>
        {horizontalGalleryParticipants && horizontalGalleryParticipants.length > 0 && (
          <SmartHorizontalGallery
            containerStyles={horizontalGalleryStyle(isNarrow)}
            childWidthRem={
              isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE.width
            }
            buttonWidthRem={isNarrow ? undefined : HORIZONTAL_GALLERY_BUTTON_WIDTH}
            gapWidthRem={HORIZONTAL_GALLERY_GAP}
          >
            {horizontalGalleryTiles}
          </SmartHorizontalGallery>
        )}
      </Stack>
    </div>
  );
};
