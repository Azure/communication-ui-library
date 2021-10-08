// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions, Modal, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { smartDominantSpeakerParticipants } from '../../gallery';
import { useIdentifiers } from '../../identifiers/IdentifierProvider';
import {
  BaseCustomStylesProps,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../../types';
import { GridLayout } from '../GridLayout';
import { StreamMedia } from '../StreamMedia';
import {
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  gridStyle,
  getHorizontalGalleryWrapperStyle,
  videoGalleryContainerStyle,
  videoGalleryOuterDivStyle
} from '../styles/VideoGallery.styles';
import { useIsSmallScreen } from '../utils/responsive';
import { VideoTile, VideoTileStylesProps } from '../VideoTile';
import { HorizontalGallery } from './HorizontalGallery';
import { RemoteVideoTile } from './RemoteVideoTile';

const emptyStyles = {};

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
  dominantSpeakers?: Array<string>;
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
    remoteParticipants,
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

  const shouldFloatLocalVideo = useMemo((): boolean => {
    return !!(layout === 'floatingLocalVideo' && remoteParticipants && remoteParticipants.length > 0);
  }, [layout, remoteParticipants]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isMobileScreen = useIsSmallScreen(containerRef);
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  // This component needs to be smart about which participants to pass to the grid and the horizontal gallery
  const [gridParticipants, setGridParticipants] = useState<VideoGalleryRemoteParticipant[]>();
  const [horizontalGalleryParticipants, setHorizontalGalleryParticipants] = useState<VideoGalleryRemoteParticipant[]>();

  useEffect(() => {
    visibleVideoParticipants.current = smartDominantSpeakerParticipants({
      participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
      dominantSpeakers,
      visibleParticipants: visibleVideoParticipants.current.filter((p) => p.videoStream?.isAvailable)
    });

    // Create a map of visibleVideoParticipants for faster searching.
    // This map will be used to identify overflow participants. i.e., participants
    // that should be rendered in horizontal gallery.
    const visibleVideoParticipantsMap = {};
    visibleVideoParticipants.current.forEach((p) => {
      visibleVideoParticipantsMap[p.userId] = true;
    });
    // Max Tiles calculated inside that gallery can be passed to this function
    // to only return the max number of tiles that can be rendered in the gallery.
    visibleAudioParticipants.current = smartDominantSpeakerParticipants({
      participants: remoteParticipants?.filter((p) => !visibleVideoParticipantsMap[p.userId]) ?? [],
      dominantSpeakers,
      visibleParticipants: visibleAudioParticipants.current.filter((p) => !visibleVideoParticipantsMap[p.userId]),
      maxTiles: 100,
      maxDominantSpeakers: 6
    });

    // If there are no video participants, we assign all audio participants as grid participants and assign
    // an empty array as horizontal gallery partipants to avoid rendering the horizontal gallery.
    if (visibleVideoParticipants.current.length === 0) {
      setGridParticipants(visibleAudioParticipants.current);
      setHorizontalGalleryParticipants([]);
    } else {
      setGridParticipants(visibleVideoParticipants.current);
      setHorizontalGalleryParticipants(visibleAudioParticipants.current);
    }
  }, [dominantSpeakers, remoteParticipants]);

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const defaultOnRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    let localVideoTileStyles: VideoTileStylesProps = {};
    if (shouldFloatLocalVideo) {
      localVideoTileStyles = floatingLocalVideoTileStyle;
    }

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
        styles={localVideoTileStyles}
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

  /**
   * Utility function for memoized rendering of RemoteParticipants.
   */
  const defaultOnRenderRemoteParticipants = useMemo(() => {
    // If user provided a custom onRender function return that function.
    if (onRenderRemoteVideoTile) {
      return remoteParticipants?.map((participant) => onRenderRemoteVideoTile(participant));
    }

    // Else return Remote Stream Video Tiles
    return gridParticipants?.map((participant): JSX.Element => {
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
  }, [
    onRenderRemoteVideoTile,
    gridParticipants,
    remoteParticipants,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    remoteVideoViewOption,
    onRenderAvatar,
    showMuteIndicator
  ]);

  const gridLayout = shouldFloatLocalVideo ? (
    <GridLayout styles={styles ?? emptyStyles}>{defaultOnRenderRemoteParticipants}</GridLayout>
  ) : (
    <GridLayout styles={styles ?? emptyStyles}>
      <Stack data-ui-id={ids.videoGallery} horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && defaultOnRenderLocalVideoTile}
      </Stack>
      {defaultOnRenderRemoteParticipants}
    </GridLayout>
  );

  return (
    <div ref={containerRef} className={videoGalleryOuterDivStyle}>
      <Stack id={floatingTileHostId} grow styles={videoGalleryContainerStyle}>
        {shouldFloatLocalVideo && (
          <Modal
            isOpen={true}
            isModeless={true}
            dragOptions={DRAG_OPTIONS}
            styles={floatingLocalVideoModalStyle(isMobileScreen)}
            layerProps={{ hostId: floatingTileHostId }}
          >
            {localParticipant && defaultOnRenderLocalVideoTile}
          </Modal>
        )}
        {gridLayout}
        {horizontalGalleryParticipants && horizontalGalleryParticipants.length > 0 && (
          <Stack style={getHorizontalGalleryWrapperStyle(isMobileScreen)}>
            <HorizontalGallery
              onCreateRemoteStreamView={onCreateRemoteStreamView}
              onDisposeRemoteStreamView={onDisposeRemoteStreamView}
              onRenderAvatar={onRenderAvatar}
              onRenderRemoteVideoTile={onRenderRemoteVideoTile}
              participants={horizontalGalleryParticipants}
              remoteVideoViewOption={remoteVideoViewOption}
              showMuteIndicator={showMuteIndicator}
              hideRemoteVideoStream={shouldFloatLocalVideo}
              rightGutter={shouldFloatLocalVideo ? (isMobileScreen ? 64 : 176) : undefined} // to leave a gap for the floating local video
            />
          </Stack>
        )}
      </Stack>
    </div>
  );
};

const floatingTileHostId = 'UILibraryFloatingTileHost';
