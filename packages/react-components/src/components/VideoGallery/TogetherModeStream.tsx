// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useMemo, memo, useState } from 'react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import {
  ReactionResources,
  VideoGalleryTogetherModeParticipantPosition,
  VideoGalleryTogetherModeStreams,
  TogetherModeStreamViewResult,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  TogetherModeStreamOptions
} from '../../types';
import { StreamMedia } from '../StreamMedia';
import { MeetingReactionOverlay } from '../MeetingReactionOverlay';
import { Stack } from '@fluentui/react';
import { togetherModeStreamRootStyle } from '../styles/TogetherMode.styles';
/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const TogetherModeStream = memo(
  (props: {
    startTogetherModeEnabled?: boolean;
    isTogetherModeActive?: boolean;
    onCreateTogetherModeStreamView?: (
      options?: TogetherModeStreamOptions
    ) => Promise<void | TogetherModeStreamViewResult>;
    onStartTogetherMode?: (options?: VideoStreamOptions) => Promise<void | TogetherModeStreamViewResult>;
    onDisposeTogetherModeStreamView?: () => Promise<void>;
    onSetTogetherModeSceneSize?: (width: number, height: number) => void;
    togetherModeStreams?: VideoGalleryTogetherModeStreams;
    seatingCoordinates?: VideoGalleryTogetherModeParticipantPosition;
    reactionResources?: ReactionResources;
    localParticipant?: VideoGalleryLocalParticipant;
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    containerWidth?: number;
    containerHeight?: number;
  }): JSX.Element => {
    const {
      startTogetherModeEnabled,
      isTogetherModeActive,
      onCreateTogetherModeStreamView,
      onStartTogetherMode,
      onSetTogetherModeSceneSize,
      onDisposeTogetherModeStreamView,
      togetherModeStreams,
      containerWidth,
      containerHeight
    } = props;

    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

    useEffect(() => {
      return () => {
        // TODO: Isolate disposing behaviors for screenShare and videoStream
        onDisposeTogetherModeStreamView && onDisposeTogetherModeStreamView();
      };
    }, [onDisposeTogetherModeStreamView]);

    // Trigger startTogetherMode only when needed
    useEffect(() => {
      if (startTogetherModeEnabled && !isTogetherModeActive) {
        onStartTogetherMode?.();
      }
    }, [startTogetherModeEnabled, isTogetherModeActive, onStartTogetherMode]);

    // Create stream view if not already created
    useEffect(() => {
      if (togetherModeStreams?.mainVideoStream?.isAvailable && !togetherModeStreams?.mainVideoStream?.renderElement) {
        onCreateTogetherModeStreamView?.();
      }
    }, [
      togetherModeStreams?.mainVideoStream?.renderElement,
      togetherModeStreams?.mainVideoStream?.isAvailable,
      onCreateTogetherModeStreamView
    ]);
    // Re-render the component if mainVideoStream isReceiving changes
    useEffect(() => {
      setShowLoadingIndicator(!togetherModeStreams?.mainVideoStream?.isReceiving);
      // This effect will trigger a re-render when isReceiving changes
    }, [togetherModeStreams?.mainVideoStream?.isReceiving]);
    // Update scene size only when container dimensions change
    useMemo(() => {
      if (onSetTogetherModeSceneSize && containerWidth && containerHeight) {
        onSetTogetherModeSceneSize(containerWidth, containerHeight);
      }
    }, [onSetTogetherModeSceneSize, containerWidth, containerHeight]);

    const stream = props.togetherModeStreams?.mainVideoStream;

    return containerWidth && containerHeight ? (
      <Stack
        styles={togetherModeStreamRootStyle}
        horizontalAlign="center"
        verticalAlign="center"
        data-ui-id="together-mode-layout"
      >
        <StreamMedia
          videoStreamElement={stream?.renderElement || null}
          isMirrored={true}
          loadingState={showLoadingIndicator ? 'loading' : 'none'}
        />
        <MeetingReactionOverlay
          reactionResources={props.reactionResources || ({} as ReactionResources)}
          localParticipant={props.localParticipant}
          remoteParticipants={props.remoteParticipants}
          togetherModeSeatPositions={props.seatingCoordinates}
          overlayMode="together-mode"
        />
      </Stack>
    ) : (
      <></>
    );
  }
);
