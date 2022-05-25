// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CreateVideoStreamViewResult, OnRenderAvatarCallback, VideoStreamOptions } from '../types';
import { StreamMedia } from './StreamMedia';
import {
  useRemoteVideoStreamLifecycleMaintainer,
  RemoteVideoStreamLifecycleMaintainerProps
} from './VideoGallery/useVideoStreamLifecycleMaintainer';
import { VideoTile } from './VideoTile';

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
  }) => {
    const {
      isAvailable,
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

    const remoteVideoStreamProps: RemoteVideoStreamLifecycleMaintainerProps = useMemo(
      () => ({
        isMirrored: remoteVideoViewOptions?.isMirrored,
        isScreenSharingOn,
        isStreamAvailable: isAvailable,
        onCreateRemoteStreamView,
        onDisposeRemoteStreamView,
        remoteParticipantId: userId,
        renderElementExists: !!renderElement,
        scalingMode: remoteVideoViewOptions?.scalingMode
      }),
      [
        isAvailable,
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

      return <StreamMedia videoStreamElement={renderElement} />;
    }, [renderElement]);

    return (
      <VideoTile
        key={userId}
        userId={userId}
        renderElement={renderVideoStreamElement}
        displayName={displayName}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={isMuted}
        isSpeaking={isSpeaking}
        showMuteIndicator={showMuteIndicator}
        showLabel={props.showLabel}
        personaMinSize={props.personaMinSize}
      />
    );
  }
);
