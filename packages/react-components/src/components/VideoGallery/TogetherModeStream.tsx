// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useEffect, useMemo } from 'react';
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
import { togetherModeStreamRootStyle } from '../styles/TogetherMode.styles';
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
      onDisposeTogetherModeStreamView,
      togetherModeStreams,
      containerWidth,
      containerHeight
    } = props;

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
      if (!togetherModeStreams?.mainVideoStream?.renderElement) {
        onCreateTogetherModeStreamView?.();
      }
    }, [togetherModeStreams?.mainVideoStream?.renderElement, onCreateTogetherModeStreamView]);

    // Update scene size only when container dimensions change
    useMemo(() => {
      if (onSetTogetherModeSceneSize && containerWidth && containerHeight) {
        onSetTogetherModeSceneSize(containerWidth, containerHeight);
      }
    }, [onSetTogetherModeSceneSize, containerWidth, containerHeight]);

    const stream = props.togetherModeStreams?.mainVideoStream;
    const showLoadingIndicator = !(stream && stream.isAvailable && stream.isReceiving);
    return containerWidth && containerHeight ? (
      <Stack styles={togetherModeStreamRootStyle} horizontalAlign="center" verticalAlign="center">
        <StreamMedia
          videoStreamElement={stream?.renderElement || null}
          isMirrored={true}
          loadingState={showLoadingIndicator ? 'loading' : 'none'}
          styles={{
            root: {
              border: '2px solid yellow'
            }
          }}
        />
        <MeetingReactionOverlay
          reactionResources={props.reactionResources || ({} as ReactionResources)}
          localParticipant={props.localParticipant}
          remoteParticipants={props.remoteParticipants}
          togetherModeSeatPositions={props.seatingCoordinates}
          overlayMode="together-mode"
        />
      </Stack>
    ) : null;
  }
);
