// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions, Modal, Stack, concatStyleSets } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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
import {
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  gridStyle,
  videoGalleryContainerStyle,
  videoWithNoRoundedBorderStyle
} from './styles/VideoGallery.styles';
import { VideoTile } from './VideoTile';

const emptyStyles = {};

const MAX_VIDEO_PARTICIPANTS_TILES = 4; // Currently the Calling JS SDK supports up to 4 remote video streams
const MAX_AUDIO_DOMINANT_SPEAKERS = 6; // We only want to set aside 6 dominant speakers for audio participants as per design

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

  const shouldFloatLocalVideo = useCallback((): boolean => {
    return !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);
  }, [layout, remoteParticipants.length]);

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

  const allParticipants = visibleVideoParticipants.current.concat(visibleAudioParticipants.current);

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const defaultOnRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    const localVideoTileStyles = shouldFloatLocalVideo() ? floatingLocalVideoTileStyle : {};

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
        onRenderPlaceholder={onRenderAvatar}
        isMuted={localParticipant.isMuted}
        showMuteIndicator={showMuteIndicator}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localParticipant,
    localParticipant.videoStream,
    localParticipant.videoStream?.renderElement,
    onCreateLocalStreamView,
    onRenderLocalVideoTile,
    onRenderAvatar,
    shouldFloatLocalVideo
  ]);

  const remoteParticipantTiles = onRenderRemoteVideoTile
    ? allParticipants.map((participant) => onRenderRemoteVideoTile(participant))
    : allParticipants.map((participant): JSX.Element => {
        const remoteVideoStream = participant.videoStream;
        return (
          <RemoteVideoTile
            key={participant.userId}
            userId={participant.userId}
            onCreateRemoteStreamView={onCreateRemoteStreamView}
            onDisposeRemoteStreamView={onDisposeRemoteStreamView}
            isAvailable={remoteVideoStream?.isAvailable}
            isMuted={participant.isMuted}
            isSpeaking={participant.isSpeaking}
            renderElement={remoteVideoStream?.renderElement}
            displayName={participant.displayName}
            remoteVideoViewOption={remoteVideoViewOption}
            onRenderAvatar={onRenderAvatar}
            showMuteIndicator={showMuteIndicator}
          />
        );
      });

  const floatingLocalVideoModalStyleThemed = useMemo(
    () =>
      concatStyleSets(floatingLocalVideoModalStyle, {
        main: { boxShadow: theme.effects.elevation8, borderRadius: theme.effects.roundedCorner4 }
      }),
    [theme.effects.elevation8, theme.effects.roundedCorner4]
  );

  if (shouldFloatLocalVideo()) {
    const floatingTileHostId = 'UILibraryFloatingTileHost';
    return (
      <Stack id={floatingTileHostId} grow styles={videoGalleryContainerStyle}>
        <Modal
          isOpen={true}
          isModeless={true}
          dragOptions={DRAG_OPTIONS}
          styles={floatingLocalVideoModalStyleThemed}
          layerProps={{ hostId: floatingTileHostId }}
        >
          {localParticipant && defaultOnRenderLocalVideoTile}
        </Modal>
        <GridLayout styles={styles ?? emptyStyles}>{remoteParticipantTiles}</GridLayout>
      </Stack>
    );
  }

  return (
    <GridLayout styles={styles ?? emptyStyles}>
      <Stack data-ui-id={ids.videoGallery} horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && defaultOnRenderLocalVideoTile}
      </Stack>
      {remoteParticipantTiles}
    </GridLayout>
  );
};

// Use React.memo to create memoize cache for each RemoteVideoTile
const RemoteVideoTile = React.memo(
  (props: {
    userId: string;
    onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
    renderElement?: HTMLElement;
    displayName?: string;
    remoteVideoViewOption?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
  }) => {
    const {
      isAvailable,
      isMuted,
      isSpeaking,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOption,
      renderElement,
      userId,
      displayName,
      onRenderAvatar,
      showMuteIndicator
    } = props;

    useEffect(() => {
      if (isAvailable && !renderElement) {
        onCreateRemoteStreamView && onCreateRemoteStreamView(userId, remoteVideoViewOption);
      }
      if (!isAvailable) {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      }
    }, [
      isAvailable,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOption,
      renderElement,
      userId
    ]);

    useEffect(() => {
      return () => {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      };
    }, [onDisposeRemoteStreamView, userId]);

    const renderVideoStreamElement = useMemo(() => {
      // Checking if renderElement is well defined or not as calling SDK has a number of video streams limitation which
      // implies that, after their threshold, all streams have no child (blank video)
      if (!renderElement || !renderElement.childElementCount) {
        // Returning `undefined` results in the placeholder with avatar being shown
        return undefined;
      }

      const videoStyles = isSpeaking ? videoWithNoRoundedBorderStyle : {};

      return <StreamMedia styles={videoStyles} videoStreamElement={renderElement} />;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderElement, renderElement?.childElementCount, isSpeaking]);

    return (
      <Stack className={gridStyle} key={userId} grow>
        <VideoTile
          userId={userId}
          renderElement={renderVideoStreamElement}
          displayName={displayName}
          onRenderPlaceholder={onRenderAvatar}
          isMuted={isMuted}
          isSpeaking={isSpeaking}
          showMuteIndicator={showMuteIndicator}
        />
      </Stack>
    );
  }
);
