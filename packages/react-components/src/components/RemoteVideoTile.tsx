// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CreateVideoStreamViewResult, OnRenderAvatarCallback, ParticipantState, VideoStreamOptions } from '../types';
import { StreamMedia } from './StreamMedia';
import {
  useRemoteVideoStreamLifecycleMaintainer,
  RemoteVideoStreamLifecycleMaintainerProps
} from './VideoGallery/useVideoStreamLifecycleMaintainer';
import { VideoTile } from './VideoTile';
/* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
import { SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM } from './styles/VideoGallery.styles';
/* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
import { _useContainerWidth } from './utils/responsive';

/**
 * A memoized version of VideoTile for rendering remote participants. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering a VideoTile when its position in the
 * array changes causing a rerender in the parent component. https://reactjs.org/docs/react-api.html#reactmemo
 *
 * @internal
 */
export const _RemoteVideoTile = React.memo(
  (props: {
    userId: string;
    onCreateRemoteStreamView?: (
      userId: string,
      options?: VideoStreamOptions
    ) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isReceiving?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
    isScreenSharingOn?: boolean; // TODO: Remove this once onDisposeRemoteStreamView no longer disposes of screen share stream
    renderElement?: HTMLElement;
    displayName?: string;
    remoteVideoViewOptions?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
    showLabel?: boolean;
    personaMinSize?: number;
    participantState?: ParticipantState;
    isNarrow?: boolean;
  }) => {
    const {
      isAvailable,
      isReceiving = true, // default to true to prevent any breaking change
      isMuted,
      isSpeaking,
      isScreenSharingOn,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOptions,
      renderElement,
      userId,
      displayName,
      onRenderAvatar,
      showMuteIndicator
    } = props;

    const containerRef = React.useRef<HTMLDivElement>(null);
    /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
    const containerWidth = _useContainerWidth(containerRef);

    const remoteVideoStreamProps: RemoteVideoStreamLifecycleMaintainerProps = useMemo(
      () => ({
        isMirrored: remoteVideoViewOptions?.isMirrored,
        isScreenSharingOn,
        isStreamAvailable: isAvailable,
        isStreamReceiving: isReceiving,
        onCreateRemoteStreamView,
        onDisposeRemoteStreamView,
        remoteParticipantId: userId,
        renderElementExists: !!renderElement,
        scalingMode: remoteVideoViewOptions?.scalingMode
      }),
      [
        isAvailable,
        isReceiving,
        isScreenSharingOn,
        onCreateRemoteStreamView,
        onDisposeRemoteStreamView,
        remoteVideoViewOptions?.isMirrored,
        remoteVideoViewOptions?.scalingMode,
        renderElement,
        userId
      ]
    );

    // Handle creating, destroying and updating the video stream as necessary
    useRemoteVideoStreamLifecycleMaintainer(remoteVideoStreamProps);

    const renderVideoStreamElement = useMemo(() => {
      // Checking if renderElement is well defined or not as calling SDK has a number of video streams limitation which
      // implies that, after their threshold, all streams have no child (blank video)
      if (!renderElement || !renderElement.childElementCount) {
        // Returning `undefined` results in the placeholder with avatar being shown
        return undefined;
      }

      return (
        <StreamMedia videoStreamElement={renderElement} loadingState={isReceiving === false ? 'loading' : 'none'} />
      );
    }, [renderElement, isReceiving]);

    const showLabelTrampoline = useMemo(() => {
      /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
      return canShowLabel(props.participantState, props.isNarrow, props.showLabel, containerWidth);
      return props.showLabel;
    }, [
      /* @conditional-compile-remove(one-to-n-calling) */
      /* @conditional-compile-remove(PSTN-calls) */
      containerWidth,
      props
    ]);

    return (
      <div ref={containerRef}>
        <VideoTile
          key={userId}
          userId={userId}
          renderElement={renderVideoStreamElement}
          displayName={displayName}
          onRenderPlaceholder={onRenderAvatar}
          isMuted={isMuted}
          isSpeaking={isSpeaking}
          showMuteIndicator={showMuteIndicator}
          personaMinSize={props.personaMinSize}
          showLabel={showLabelTrampoline}
          /* @conditional-compile-remove(one-to-n-calling) */
          /* @conditional-compile-remove(PSTN-calls) */
          participantState={props.participantState}
        />
      </div>
    );
  }
);

/* @conditional-compile-remove(one-to-n-calling) */
/* @conditional-compile-remove(PSTN-calls) */
/**
 * Determines if a label should be shown for a remote video tile.
 * When the remote video tile is rendered as a small tile in horizontal gallery,
 * we hide the participants name if they are in hold/connecting states.
 */
const canShowLabel = (
  participantState?: ParticipantState,
  isNarrow?: boolean,
  showLabel?: boolean,
  containerWidth?: number
): boolean | undefined => {
  const isCallingOrHold = (participantState?: ParticipantState): boolean => {
    return !!participantState && ['Idle', 'Connecting', 'EarlyMedia', 'Ringing', 'Hold'].includes(participantState);
  };

  // if showLabel has been explicitly set to false, don't show the label
  if (showLabel === false) {
    return showLabel;
  }
  // if the remote video tile is in a narrow layout and participant state should be displayed,
  // don't show the label if video tile is compact.
  if (isCallingOrHold(participantState) && isNarrow) {
    if (containerWidth && containerWidth / 16 <= SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width) {
      return false;
    }
  }

  return showLabel;
};
