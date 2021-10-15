// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, mergeStyles, Stack } from '@fluentui/react';
import React, { CSSProperties, useMemo, useRef, useState } from 'react';
import { OnRenderAvatarCallback, VideoGalleryRemoteParticipant, VideoStreamOptions } from '../../types';
import {
  horizontalGalleryContainerStyle,
  LARGE_BUTTON_STYLE,
  LARGE_TILE_SIZE,
  LARGE_TILE_STYLE,
  leftRightButtonStyles,
  SMALL_BUTTON_STYLE,
  SMALL_TILE_SIZE,
  SMALL_TILE_STYLE
} from '../styles/HorizontalGallery.styles';
import { useContainerWidth, isNarrowWidth } from '../utils/responsive';
import { RemoteVideoTile } from './RemoteVideoTile';

/**
 * HorizontalGallery Component Props.
 */
export interface HorizontalGalleryProps {
  participants: VideoGalleryRemoteParticipant[];
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

const PX_PER_REM = 16;

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
    leftGutter = 0.5,
    rightGutter = 0.5
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isNarrow = isNarrowWidth(containerWidth);
  const [page, setPage] = useState(0);

  const maxTiles = useMemo(() => {
    setPage(0);
    if (isNarrow) {
      return calculateMaxNumberOfTiles({
        width: containerWidth - (leftGutter + rightGutter) * PX_PER_REM,
        tileWidth: SMALL_TILE_SIZE.width,
        buttonsWidth: 0
      });
    } else {
      return calculateMaxNumberOfTiles({
        width: containerWidth - (leftGutter + rightGutter) * PX_PER_REM,
        tileWidth: LARGE_TILE_SIZE.width
      });
    }
  }, [containerWidth, isNarrow, leftGutter, rightGutter]);

  const tileSizeStyle = isNarrow ? SMALL_TILE_STYLE : LARGE_TILE_STYLE;
  const leftRightButtonHeightStyles = isNarrow ? SMALL_BUTTON_STYLE : LARGE_BUTTON_STYLE;

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

  const showLeftButton = maxTiles && page > 0 && !isNarrow;
  const showRightButton = maxTiles && page < maxPageIndex && !isNarrow;

  return (
    <div ref={containerRef}>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={{ childrenGap: '0.5rem' }}
        className={mergeStyles(horizontalGalleryContainerStyle, {
          paddingLeft: `${leftGutter}rem`,
          paddingRight: `${rightGutter}rem`
        })}
      >
        {showLeftButton && (
          <LeftButton style={leftRightButtonHeightStyles} onClick={() => setPage(Math.max(0, page - 1))} />
        )}
        {defaultOnRenderParticipants}
        {showRightButton && (
          <RightButton style={leftRightButtonHeightStyles} onClick={() => setPage(Math.min(maxPageIndex, page + 1))} />
        )}
      </Stack>
    </div>
  );
};

const calculateMaxNumberOfTiles = ({ width, tileWidth = 10, buttonsWidth = 4, gapBetweenTiles = 0.5 }): number => {
  /**
   * A Safe Padding should be reduced from the parent width to ensure that the total width of all video tiles rendered
   * is always less than the window width. (Window width after subtracting all margins, paddings etc.)
   * This ensures that video tiles don't tirgger an overflow which will prevent parent component from shrinking.
   */
  const safePadding = 1;
  return Math.floor(
    (width - buttonsWidth * PX_PER_REM - safePadding * PX_PER_REM) /
      (tileWidth * PX_PER_REM + gapBetweenTiles * PX_PER_REM)
  );
};

const LeftButton = (props: { style: CSSProperties; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton className={mergeStyles(leftRightButtonStyles)} onClick={props.onClick} style={props.style}>
      <Icon iconName="HorizontalGalleryLeftButton" />
    </DefaultButton>
  );
};

const RightButton = (props: { style: CSSProperties; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton className={mergeStyles(leftRightButtonStyles)} onClick={props.onClick} style={props.style}>
      <Icon iconName="HorizontalGalleryRightButton" />
    </DefaultButton>
  );
};
