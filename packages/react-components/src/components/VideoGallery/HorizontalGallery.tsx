// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OnRenderAvatarCallback, VideoGalleryRemoteParticipant, VideoStreamOptions } from '../../types';
import { horizontalGalleryContainerStyle, leftRightButtonStyles } from '../styles/HorizontalGallery.styles';
import { useContainerWidth, useIsSmallScreen } from '../utils/responsive';
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
  /** Default `false`. If set to true, video tiles will not render remote video stream  */
  hideRemoteVideoStream?: boolean;
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
    hideRemoteVideoStream,
    leftGutter = 8,
    rightGutter = 8
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useIsSmallScreen(containerRef);
  const containerWidth = useContainerWidth(containerRef);
  const [page, setPage] = useState(0);
  const [maxTiles, setMaxTiles] = useState(0);
  const [tileHeight, setTileHeight] = useState(120);
  const [tileWidth, setTileWidth] = useState(160);

  useEffect(() => {
    setPage(0);
    if (isSmallScreen) {
      setTileHeight(88);
      setTileWidth(88);
      const maxTiles = calculateMaxNumberOfTiles({
        width: containerWidth - (leftGutter + rightGutter),
        tileWidth: 88,
        buttonsWidth: 0
      });
      setMaxTiles(maxTiles);
    } else {
      setTileHeight(120);
      setTileWidth(160);
      const maxTiles = calculateMaxNumberOfTiles({
        width: containerWidth - (leftGutter + rightGutter),
        tileWidth: 160
      });
      setMaxTiles(maxTiles);
    }
  }, [containerWidth, isSmallScreen, leftGutter, rightGutter]);

  const tileSizeStyle = useMemo(
    () => ({
      minHeight: `${tileHeight}px`,
      minWidth: `${tileWidth}px`,
      maxHeight: `${tileHeight}px`,
      maxWidth: `${tileWidth}px`
    }),
    [tileWidth, tileHeight]
  );

  const maxPageIndex = Math.ceil(participants.length / maxTiles) - 1;

  const defaultOnRenderParticipants = useMemo(() => {
    const start = page * maxTiles;
    const end = start + maxTiles;
    return participants?.slice(start, end).map((participant): JSX.Element => {
      const remoteVideoStream = participant.videoStream;
      return onRenderRemoteVideoTile ? (
        onRenderRemoteVideoTile(participant)
      ) : (
        <Stack key={participant.userId} className={mergeStyles(tileSizeStyle)}>
          <RemoteVideoTile
            key={participant.userId}
            userId={participant.userId}
            onCreateRemoteStreamView={hideRemoteVideoStream ? undefined : onCreateRemoteStreamView}
            onDisposeRemoteStreamView={hideRemoteVideoStream ? undefined : onDisposeRemoteStreamView}
            isAvailable={hideRemoteVideoStream ? false : remoteVideoStream?.isAvailable}
            renderElement={hideRemoteVideoStream ? undefined : remoteVideoStream?.renderElement}
            remoteVideoViewOption={hideRemoteVideoStream ? undefined : remoteVideoViewOption}
            isMuted={participant.isMuted}
            isSpeaking={participant.isSpeaking}
            displayName={participant.displayName}
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
    hideRemoteVideoStream,
    remoteVideoViewOption,
    onRenderAvatar,
    showMuteIndicator
  ]);

  const showLeftButton = maxTiles && page > 0 && !isSmallScreen;
  const showRightButton = maxTiles && page < maxPageIndex && !isSmallScreen;

  return (
    <div ref={containerRef}>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={{ childrenGap: '0.5rem' }}
        className={mergeStyles(horizontalGalleryContainerStyle, { paddingLeft: leftGutter, paddingRight: rightGutter })}
      >
        {showLeftButton && <LeftButton height={tileHeight} onClick={() => setPage(Math.max(0, page - 1))} />}
        {defaultOnRenderParticipants}
        {showRightButton && (
          <RightButton height={tileHeight} onClick={() => setPage(Math.min(maxPageIndex, page + 1))} />
        )}
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

const LeftButton = (props: { height: number; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles, {
        minWidth: '1.75rem',
        minHeight: `${props.height}px`,
        maxWidth: '1.75rem',
        maxHeight: `${props.height}px`
      })}
      onClick={props.onClick}
    >
      <Icon iconName="HorizontalGalleryLeftButton" />
    </DefaultButton>
  );
};

const RightButton = (props: { height: number; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles, {
        minWidth: '1.75rem',
        minHeight: `${props.height}px`,
        maxWidth: '1.75rem',
        maxHeight: `${props.height}px`
      })}
      onClick={props.onClick}
    >
      <Icon iconName="HorizontalGalleryRightButton" />
    </DefaultButton>
  );
};
