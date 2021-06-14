// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, Modal, IDragOptions, ContextualMenu } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseCustomStylesProps,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { floatingLocalVideoModalStyle, floatingLocalVideoTileStyle, gridStyle } from './styles/VideoGallery.styles';
import { VideoTile, PlaceholderProps, VideoTileStylesProps } from './VideoTile';

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
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
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
  const [sortedRemoteParticipants, setSortedRemoteParticipants] = useState<VideoGalleryRemoteParticipant[] | undefined>(
    undefined
  );
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
    onRenderAvatar
  } = props;

  useEffect(() => {
    sortRemoteVideoTiles();
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
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, localParticipant.videoStream, onCreateLocalStreamView, onRenderLocalVideoTile, onRenderAvatar]);

  const sortRemoteVideoTiles = useCallback(() => {
    if (!remoteParticipants) {
      setSortedRemoteParticipants(undefined);
      return;
    }

    const newParticipants = remoteParticipants.sort((p1, p2) => {
      console.log(`comparing ${p1.displayName} and ${p2.displayName} streams`);
      if (!p1?.videoStream?.renderElement?.childElementCount && !p2?.videoStream?.renderElement?.childElementCount) {
        console.log(`- both undefined stream`);
        return 0;
      }
      if (!p1?.videoStream?.renderElement?.childElementCount) {
        console.log(`- ${p1.displayName} undefined stream`);
        return 1;
      }
      if (!p2?.videoStream?.renderElement?.childElementCount) {
        console.log(`- ${p2.displayName} undefined stream`);
        return -1;
      }

      console.log(`- both defined stream`);
      return 0;
    });
    setSortedRemoteParticipants(newParticipants);
  }, [remoteParticipants]);

  /**
   * Utility function for memoized rendering of RemoteParticipants.
   */
  const defaultOnRenderRemoteParticipants = useMemo(() => {
    if (!sortedRemoteParticipants) return null;

    // If user provided a custom onRender function return that function.
    if (onRenderRemoteVideoTile) {
      return sortedRemoteParticipants.map((participant) => onRenderRemoteVideoTile(participant));
    }

    // Else return Remote Stream Video Tiles
    return sortedRemoteParticipants.map(
      (participant): JSX.Element => {
        const remoteVideoStream = participant.videoStream;
        return (
          <RemoteVideoTile
            key={participant.userId}
            userId={participant.userId}
            onCreateRemoteStreamView={onCreateRemoteStreamView}
            onDisposeRemoteStreamView={onDisposeRemoteStreamView}
            isAvailable={remoteVideoStream?.isAvailable}
            renderElement={remoteVideoStream?.renderElement}
            displayName={participant.displayName}
            remoteVideoViewOption={remoteVideoViewOption}
            onRenderAvatar={onRenderAvatar}
            onVideoStreamChange={sortRemoteVideoTiles}
          />
        );
      }
    );
  }, [
    sortedRemoteParticipants,
    onRenderRemoteVideoTile,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    remoteVideoViewOption,
    onRenderAvatar
  ]);

  if (shouldFloatLocalVideo()) {
    return (
      <>
        <Modal isOpen={true} isModeless={true} dragOptions={DRAG_OPTIONS} styles={floatingLocalVideoModalStyle}>
          {localParticipant && defaultOnRenderLocalVideoTile}
        </Modal>
        <GridLayout styles={styles}>{defaultOnRenderRemoteParticipants}</GridLayout>
      </>
    );
  }

  return (
    <GridLayout styles={styles}>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
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
    onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions | undefined) => Promise<void>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    renderElement?: HTMLElement;
    displayName?: string;
    remoteVideoViewOption?: VideoStreamOptions;
    onRenderAvatar?: (
      props: PlaceholderProps,
      defaultOnRender: (props: PlaceholderProps) => JSX.Element
    ) => JSX.Element;
    onVideoStreamChange(): void;
  }) => {
    const {
      isAvailable,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOption,
      renderElement,
      userId,
      displayName,
      onRenderAvatar,
      onVideoStreamChange
    } = props;
    const [videoStreamElement, setVideoStreamElement] = useState<JSX.Element | undefined>(undefined);

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

    useEffect(() => {
      console.log(`Element count is undefined = ${!renderElement?.childElementCount} for user ${displayName}`);
      if (!renderElement || !renderElement.childElementCount) {
        setVideoStreamElement(undefined);
      } else {
        setVideoStreamElement(<StreamMedia videoStreamElement={renderElement} />);
      }

      onVideoStreamChange();
    }, [renderElement]);

    //     const renderVideoStreamElement = useMemo(() => {
    //       console.log(`Element count is undefined = ${!renderElement?.childElementCount} for user ${displayName}`)
    //       if (!renderElement || !renderElement.childElementCount) {
    //         return undefined;
    //       }

    //       return <StreamMedia videoStreamElement={renderElement} />
    //     }, [renderElement]);

    return (
      <Stack className={gridStyle} key={userId} grow>
        <VideoTile
          userId={userId}
          isVideoReady={isAvailable}
          renderElement={videoStreamElement}
          displayName={displayName}
          onRenderPlaceholder={onRenderAvatar}
        />
      </Stack>
    );
  }
);
