// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OnRenderAvatarCallback, VideoGalleryRemoteParticipant, VideoStreamOptions } from '../../types';
import { horizontalGalleryContainerStyle, leftRightButtonStyles } from '../styles/HorizontalGallery.styles';
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
  /** Space to leave on the left of this gallery in pixels. */
  leftGutter?: number;
  /** Space to leave on the right of this gallery in pixels. */
  rightGutter?: number;
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
    showMuteIndicator,
    leftGutter = 8,
    rightGutter = 8
  } = props;

  const MOBILE_WIDTH_MAX = 480;

  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [maxTiles, setMaxTiles] = useState(0);
  const [isMobile, setIsMobie] = useState(false);
  const [tileHeight, setTileHeight] = useState(120);
  const [tileWidth, setTileWidth] = useState(160);

  useEffect(() => {
    const updateWidth = (): void => {
      const width = (containerRef.current?.offsetWidth ?? 0) - (leftGutter + rightGutter);
      console.log(width);
      setPage(0);
      if (width <= MOBILE_WIDTH_MAX) {
        setIsMobie(true);
        setTileHeight(88);
        setTileWidth(88);
        const maxTiles = calculateMaxNumberOfTiles({ width, tileWidth: 88, buttonsWidth: 0 });
        setMaxTiles(maxTiles);
      } else {
        setIsMobie(false);
        setTileHeight(120);
        setTileWidth(160);
        const maxTiles = calculateMaxNumberOfTiles({ width, tileWidth: 160 });
        setMaxTiles(maxTiles);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [leftGutter, rightGutter, containerRef, tileWidth]);

  const tileSizeStyle = useMemo(
    () => ({
      minHeight: `${tileHeight}px`,
      minWidth: `${tileWidth}px`,
      maxHeight: `${tileHeight}px`,
      maxWidth: `${tileWidth}px`
    }),
    [tileWidth, tileHeight]
  );

  const pageButtonSizeStyle = useMemo(
    () => ({
      minWidth: '1.75rem',
      minHeight: `${tileHeight}px`,
      maxWidth: '1.75rem',
      maxHeight: `${tileHeight}px`
    }),
    [tileHeight]
  );

  const defaultOnRenderParticipants = useMemo(() => {
    // If user provided a custom onRender function return that function.
    if (onRenderRemoteVideoTile) {
      return participants?.map((participant) => onRenderRemoteVideoTile(participant));
    }

    const start = page * maxTiles;
    const end = start + maxTiles;
    return participants?.slice(start, end).map((participant): JSX.Element => {
      const remoteVideoStream = participant.videoStream;
      return (
        <Stack key={participant.userId} className={mergeStyles(tileSizeStyle)}>
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
    page,
    maxTiles,
    participants,
    tileSizeStyle,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    remoteVideoViewOption,
    onRenderAvatar,
    showMuteIndicator
  ]);

  const changePage = (page: number): void => {
    const maxPage = Math.ceil(participants.length / maxTiles);
    if (page < 0) {
      setPage(0);
      return;
    } else if (page >= maxPage) {
      setPage(maxPage - 1);
      return;
    } else {
      setPage(page);
      return;
    }
  };

  return (
    <div ref={containerRef}>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={{ childrenGap: '0.5rem' }}
        className={mergeStyles(horizontalGalleryContainerStyle, { paddingLeft: leftGutter, paddingRight: rightGutter })}
      >
        {maxTiles && !isMobile ? (
          <DefaultButton
            className={mergeStyles(leftRightButtonStyles, pageButtonSizeStyle)}
            onClick={() => changePage(page - 1)}
          >
            <Icon iconName="HorizontalGalleryLeftButton" />
          </DefaultButton>
        ) : undefined}

        {defaultOnRenderParticipants}

        {maxTiles && !isMobile ? (
          <DefaultButton
            className={mergeStyles(leftRightButtonStyles, pageButtonSizeStyle)}
            onClick={() => changePage(page + 1)}
          >
            <Icon iconName="HorizontalGalleryRightButton" />
          </DefaultButton>
        ) : undefined}
      </Stack>
    </div>
  );
};

const calculateMaxNumberOfTiles = ({
  width,
  tileWidth = 10 * 16,
  buttonsWidth = 4 * 16,
  gapBetweenTiles = 0.5 * 16
}): number => {
  /**
   * A Safe Padding should be reduced from the parent width to ensure that the total width of all video tiles rendered
   * is always less than the window width. (Window width after subtracting all margins, paddings etc.)
   * This ensures that video tiles don't tirgger an overflow which will prevent parent component from shrinking.
   */
  const safePadding = 16;
  return Math.floor((width - buttonsWidth - safePadding) / (tileWidth + gapBetweenTiles));
};
