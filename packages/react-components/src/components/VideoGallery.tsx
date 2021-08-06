// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, Modal, IDragOptions, ContextualMenu } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import {
  BaseCustomStylesProps,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import {
  videoGalleryContainerStyle,
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  gridStyle
} from './styles/VideoGallery.styles';
import { VideoTile, PlaceholderProps, VideoTileStylesProps } from './VideoTile';

const emptyStyles = {};

/**
 * Props for component `VideoGallery`
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
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;

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

const sortParticipants = (
  participants: VideoGalleryRemoteParticipant[] | undefined
): VideoGalleryRemoteParticipant[] => {
  if (!participants) {
    return [];
  }

  return participants.sort((p1, p2) => {
    if (!p1?.videoStream?.renderElement?.childElementCount && !p2?.videoStream?.renderElement?.childElementCount) {
      return 0;
    }
    if (!p1?.videoStream?.renderElement?.childElementCount) {
      return 1;
    }
    if (!p2?.videoStream?.renderElement?.childElementCount) {
      return -1;
    }

    return 0;
  });
};

/**
 * VideoGallery represents a `GridLayout` of video tiles for a specific call.
 * It displays a `VideoTile` for the local user as well as for each remote participants who joined the call.
 *
 * @param props - of type `VideoGalleryProps`
 *
 * @returns a JSX Element
 */
export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const {
    localParticipant,
    remoteParticipants,
    localVideoViewOption,
    remoteVideoViewOption,
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
  const [sortedRemoteParticipants, setSortedRemoteParticipants] = useState<VideoGalleryRemoteParticipant[]>([]);

  const ids = useIdentifiers();

  useEffect(() => {
    setSortedRemoteParticipants(sortParticipants(remoteParticipants));
  }, [remoteParticipants]);

  const shouldFloatLocalVideo = useCallback((): boolean => {
    return !!(layout === 'floatingLocalVideo' && remoteParticipants && remoteParticipants.length > 0);
  }, [layout, remoteParticipants]);

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const defaultOnRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoReady = localVideoStream?.isAvailable;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    let localVideoTileStyles: VideoTileStylesProps = {};
    if (shouldFloatLocalVideo()) {
      localVideoTileStyles = floatingLocalVideoTileStyle;
    }

    if (localVideoStream && !localVideoStream.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
    }
    return (
      <VideoTile
        userId={localParticipant.userId}
        isVideoReady={isLocalVideoReady}
        renderElement={<StreamMedia videoStreamElement={localVideoStream?.renderElement ?? null} />}
        displayName={localParticipant?.displayName}
        styles={localVideoTileStyles}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={localParticipant.isMuted}
        showMuteIndicator={showMuteIndicator}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, localParticipant.videoStream, onCreateLocalStreamView, onRenderLocalVideoTile, onRenderAvatar]);

  /**
   * Utility function for memoized rendering of RemoteParticipants.
   */
  const defaultOnRenderRemoteParticipants = useMemo(() => {
    // If user provided a custom onRender function return that function.
    if (onRenderRemoteVideoTile) {
      return sortedRemoteParticipants.map((participant) => onRenderRemoteVideoTile(participant));
    }

    // Else return Remote Stream Video Tiles
    return sortedRemoteParticipants.map((participant): JSX.Element => {
      const remoteVideoStream = participant.videoStream;
      return (
        <RemoteVideoTile
          key={participant.userId}
          userId={participant.userId}
          onCreateRemoteStreamView={onCreateRemoteStreamView}
          onDisposeRemoteStreamView={onDisposeRemoteStreamView}
          isAvailable={remoteVideoStream?.isAvailable}
          isMuted={participant.isMuted}
          renderElement={remoteVideoStream?.renderElement}
          displayName={participant.displayName}
          remoteVideoViewOption={remoteVideoViewOption}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
        />
      );
    });
  }, [
    sortedRemoteParticipants,
    onRenderRemoteVideoTile,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    remoteVideoViewOption,
    onRenderAvatar,
    showMuteIndicator
  ]);

  if (shouldFloatLocalVideo()) {
    const floatingTileHostId = 'UILibaryFloatingTileHost';
    return (
      <Stack id={floatingTileHostId} grow styles={videoGalleryContainerStyle}>
        <Modal
          isOpen={true}
          isModeless={true}
          dragOptions={DRAG_OPTIONS}
          styles={floatingLocalVideoModalStyle}
          layerProps={{ hostId: floatingTileHostId }}
        >
          {localParticipant && defaultOnRenderLocalVideoTile}
        </Modal>
        <GridLayout styles={styles ?? emptyStyles}>{defaultOnRenderRemoteParticipants}</GridLayout>
      </Stack>
    );
  }

  return (
    <GridLayout styles={styles ?? emptyStyles}>
      <Stack data-ui-id={ids.videoGallery} horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && defaultOnRenderLocalVideoTile}
      </Stack>
      {defaultOnRenderRemoteParticipants}
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
    renderElement?: HTMLElement;
    displayName?: string;
    remoteVideoViewOption?: VideoStreamOptions;
    onRenderAvatar?: (
      props: PlaceholderProps,
      defaultOnRender: (props: PlaceholderProps) => JSX.Element
    ) => JSX.Element;
    showMuteIndicator?: boolean;
  }) => {
    const {
      isAvailable,
      isMuted,
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

      return <StreamMedia videoStreamElement={renderElement} />;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderElement, renderElement?.childElementCount]);

    return (
      <Stack className={gridStyle} key={userId} grow>
        <VideoTile
          userId={userId}
          isVideoReady={isAvailable}
          renderElement={renderVideoStreamElement}
          displayName={displayName}
          onRenderPlaceholder={onRenderAvatar}
          isMuted={isMuted}
          showMuteIndicator={showMuteIndicator}
        />
      </Stack>
    );
  }
);
