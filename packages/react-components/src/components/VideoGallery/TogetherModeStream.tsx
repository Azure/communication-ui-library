// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useEffect, useState } from 'react';
/* @conditional-compile-remove(together-mode) */
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import {
  ReactionResources,
  VideoGalleryTogetherModeParticipantPosition,
  VideoGalleryTogetherModeStreams,
  TogetherModeStreamViewResult,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../../types';
/* @conditional-compile-remove(together-mode) */
import { StreamMedia } from '../StreamMedia';
/* @conditional-compile-remove(together-mode) */
import { MeetingReactionOverlay } from '../MeetingReactionOverlay';
/* @conditional-compile-remove(together-mode) */
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(together-mode) */
import { togetherModeRootStyle } from '../styles/TogetherMode.styles'; // Ensure this is an object, not a string

/* @conditional-compile-remove(together-mode) */
/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const TogetherModeStream = React.memo(
  (props: {
    startTogetherModeEnabled?: boolean;
    isTogetherModeActive?: boolean;
    onCreateTogetherModeStreamView?: (options?: VideoStreamOptions) => Promise<void | TogetherModeStreamViewResult>;
    onStartTogetherMode?: (options?: VideoStreamOptions) => Promise<void | TogetherModeStreamViewResult>;
    onDisposeTogetherModeStreamView?: () => Promise<void>;
    onSetTogetherModeSceneSize?: (width: number, height: number) => void;
    togetherModeStreams?: VideoGalleryTogetherModeStreams;
    seatingCoordinates?: VideoGalleryTogetherModeParticipantPosition;
    reactionResources?: ReactionResources;
    localParticipant?: VideoGalleryLocalParticipant;
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    screenShareComponent?: JSX.Element;
    containerWidth?: number;
    containerHeight?: number;
  }): React.ReactNode => {
    const {
      startTogetherModeEnabled,
      isTogetherModeActive,
      onCreateTogetherModeStreamView,
      onStartTogetherMode,
      onSetTogetherModeSceneSize,
      togetherModeStreams,
      containerWidth,
      containerHeight
    } = props;

    const [sceneDimensions, setSceneDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    // Trigger startTogetherMode only when needed
    useEffect(() => {
      if (startTogetherModeEnabled && !isTogetherModeActive) {
        onStartTogetherMode?.();
      }
    }, [startTogetherModeEnabled, isTogetherModeActive, onStartTogetherMode]);

    // Create stream view if not already created
    useEffect(() => {
      if (!togetherModeStreams?.mainVideoStream?.renderElement) {
        onCreateTogetherModeStreamView?.();
      }
    }, [togetherModeStreams?.mainVideoStream?.renderElement, onCreateTogetherModeStreamView]);

    // Update scene size only when container dimensions change
    useEffect(() => {
      if (!onSetTogetherModeSceneSize) {
        console.log(`Chuk Scene change callback is null ${containerWidth} ${containerHeight}`);
      }
      if (onSetTogetherModeSceneSize && containerWidth && containerHeight) {
        if (containerWidth !== sceneDimensions.width || containerHeight !== sceneDimensions.height) {
          onSetTogetherModeSceneSize(containerWidth, containerHeight);
          console.log(`Setting scene size width to ${containerWidth}  == ${sceneDimensions.width}`);
          console.log(`Setting scene size height to ${containerHeight}  == ${sceneDimensions.height}`);
          setSceneDimensions({ width: containerWidth, height: containerHeight });
        }
      }
    }, [onSetTogetherModeSceneSize, containerWidth, containerHeight, sceneDimensions.width, sceneDimensions.height]);

    // Memoized layout computation
    const layout = getTogetherModeMainVideoLayout(props);

    return layout;
  }
);

/* @conditional-compile-remove(together-mode) */
const getTogetherModeMainVideoLayout = (props: {
  togetherModeStreams?: VideoGalleryTogetherModeStreams;
  containerWidth?: number;
  containerHeight?: number;
  reactionResources?: ReactionResources;
  localParticipant?: VideoGalleryLocalParticipant;
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  seatingCoordinates?: VideoGalleryTogetherModeParticipantPosition;
}): JSX.Element | null => {
  const stream = props.togetherModeStreams?.mainVideoStream;
  const showLoadingIndicator = stream && stream.isAvailable && stream.isReceiving;

  return props.containerWidth && props.containerHeight ? (
    <Stack>
      <div
        data-ui-id="together-mode-video-tile"
        style={{
          width: `${_pxToRem(props.containerWidth)}`,
          height: `${_pxToRem(props.containerHeight)}`,
          position: 'relative'
        }}
      >
        <StreamMedia
          videoStreamElement={stream?.renderElement || null}
          isMirrored={true}
          loadingState={showLoadingIndicator ? 'loading' : 'none'}
          styles={togetherModeRootStyle(props.containerWidth, props.containerHeight)}
        />
        {props.reactionResources && (
          <MeetingReactionOverlay
            reactionResources={props.reactionResources}
            localParticipant={props.localParticipant}
            remoteParticipants={props.remoteParticipants}
            seatingCoordinates={props.seatingCoordinates}
            overlayMode="together-mode"
          />
        )}
      </div>
    </Stack>
  ) : null;
};
