// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useEffect } from 'react';
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
/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const TogetherModeStream = React.memo(
  (props: {
    canStartTogetherMode?: boolean;
    isTogetherModeActive?: boolean;
    onCreateTogetherModeStreamView?: (options?: VideoStreamOptions) => Promise<void | TogetherModeStreamViewResult>;
    onStartTogetherMode?: (options?: VideoStreamOptions) => Promise<void | TogetherModeStreamViewResult>;
    onDisposeTogetherModeStreamViews?: () => Promise<void>;
    onSetTogetherModeSceneSize?: (width: number, height: number) => void;
    togetherModeStreams?: VideoGalleryTogetherModeStreams;
    seatingCoordinates?: VideoGalleryTogetherModeParticipantPosition;
    reactionResources?: ReactionResources;
    localParticipant?: VideoGalleryLocalParticipant;
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    containerWidth?: number;
    containerHeight?: number;
  }): React.ReactNode => {
    const {
      canStartTogetherMode,
      isTogetherModeActive,
      onCreateTogetherModeStreamView,
      onStartTogetherMode,
      onSetTogetherModeSceneSize,
      togetherModeStreams,
      seatingCoordinates,
      reactionResources,
      localParticipant,
      remoteParticipants,
      containerWidth,
      containerHeight
    } = props;

    if (canStartTogetherMode && !isTogetherModeActive) {
      onStartTogetherMode && onStartTogetherMode();
    }

    if (!togetherModeStreams?.mainVideoStream?.renderElement) {
      onCreateTogetherModeStreamView && onCreateTogetherModeStreamView();
    }

    useEffect(() => {
      onSetTogetherModeSceneSize &&
        containerWidth &&
        containerHeight &&
        onSetTogetherModeSceneSize(containerWidth, containerHeight);
    }, [onSetTogetherModeSceneSize, containerWidth, containerHeight]);

    const stream = togetherModeStreams?.mainVideoStream;
    const showLoadingIndicator = stream && stream.isAvailable && stream.isReceiving;

    return (
      <>
        {containerWidth && containerHeight && (
          <Stack
            style={{
              width: `${_pxToRem(containerWidth)}rem`,
              height: `${_pxToRem(containerHeight)}rem`,
              position: 'relative',
              pointerEvents: 'none'
            }}
          >
            <div data-ui-id="together-mode-video-tile">
              <StreamMedia
                videoStreamElement={stream?.renderElement || null}
                isMirrored={true}
                loadingState={showLoadingIndicator ? 'loading' : 'none'}
              />
              {reactionResources && (
                <MeetingReactionOverlay
                  reactionResources={reactionResources}
                  localParticipant={localParticipant}
                  remoteParticipants={remoteParticipants}
                  seatingCoordinates={seatingCoordinates}
                  overlayMode="together-mode"
                />
              )}
            </div>
          </Stack>
        )}
      </>
    );
  }
);
