// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { OnRenderAvatarCallback, VideoGalleryRemoteParticipant, VideoStreamOptions } from '../../types';
import { RemoteVideoTile } from './RemoteVideoTile';

/**
 * HorizontalGallery Component Props.
 */
export interface HorizontalGalleryProps {
  participants: VideoGalleryRemoteParticipant[];
  /** Remote videos view options */
  remoteVideoViewOption?: VideoStreamOptions;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  /** Callback to render a particpant avatar */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Whether to display a mute icon beside the user's display name.
   * @defaultValue `true`
   */
  showMuteIndicator?: boolean;
}

/**
 * Renders a horizontal gallery of video tiles.
 * @param props - HorizontalGalleryProps {@link @azure/communication-react#HorizontalGalleryProps}
 * @returns
 */
export const HorizontalGallery = (props: HorizontalGalleryProps): JSX.Element => {
  const {
    participants,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    onRenderRemoteVideoTile,
    remoteVideoViewOption,
    onRenderAvatar,
    showMuteIndicator
  } = props;

  const initialWidth = Math.min(window.innerWidth, window.outerWidth);
  const localTileWidth = 10 * 16 + 0.5 * 16;

  const [maxTiles, setMaxTiles] = useState(calculateNumberOfTiles({ windowWidth: initialWidth, localTileWidth }));

  useEffect(() => {
    const updateWidth = (): void => {
      const width = Math.min(window.innerWidth, window.outerWidth);
      setMaxTiles(calculateNumberOfTiles({ windowWidth: width, localTileWidth }));
    };
    window.addEventListener('resize', updateWidth);
  }, [localTileWidth]);

  const defaultOnRenderParticipants = useMemo(() => {
    // If user provided a custom onRender function return that function.
    if (onRenderRemoteVideoTile) {
      return participants?.map((participant) => onRenderRemoteVideoTile(participant));
    }

    // Else return Remote Stream Video Tiles
    return participants?.slice(0, maxTiles).map((participant): JSX.Element => {
      const remoteVideoStream = participant.videoStream;
      return (
        <Stack
          key={participant.userId}
          style={{
            minWidth: '10rem',
            minHeight: '7.5rem',
            maxWidth: '10rem',
            maxHeight: '7.5rem'
          }}
        >
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
        </Stack>
      );
    });
  }, [
    onRenderRemoteVideoTile,
    participants,
    maxTiles,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    remoteVideoViewOption,
    onRenderAvatar,
    showMuteIndicator
  ]);

  return (
    <Stack
      horizontal
      horizontalAlign="start"
      tokens={{ childrenGap: '0.5rem' }}
      style={{ height: '100%', width: '100%', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingBottom: '0.5rem' }}
    >
      {defaultOnRenderParticipants}
    </Stack>
  );
};

const calculateNumberOfTiles = ({
  windowWidth,
  tileWidth = 10 * 16,
  gapBetweenTiles = 0.5 * 16,
  localTileWidth = 0
}): number => {
  return Math.floor((windowWidth - localTileWidth) / (tileWidth + gapBetweenTiles));
};
