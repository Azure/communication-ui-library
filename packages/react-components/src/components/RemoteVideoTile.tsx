// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo } from 'react';
import { OnRenderAvatarCallback, VideoStreamOptions } from '../types';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';

/**
 * A memoized version of VideoTile for rendering remote participants. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering a VideoTile when its position in the
 * array changes causing a rerender in the parent component. https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemoteVideoTile = React.memo(
  (props: {
    userId: string;
    onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
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

    useEffect(() => {
      if (isAvailable && !renderElement) {
        onCreateRemoteStreamView && onCreateRemoteStreamView(userId, remoteVideoViewOptions);
      }
      // Always clean up element to make tile up to date and be able to dispose correctly
      // TODO: Add an extra param to onDisposeRemoteStreamView(userId, flavor(optional)) when api lock is released
      // and isolate dispose behavior between screen share and video
      return () => {
        if (renderElement && !isScreenSharingOn) {
          onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
        }
      };
    }, [
      isAvailable,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOptions,
      renderElement,
      userId,
      isScreenSharingOn
    ]);

    // The execution order for above useEffect is onCreateRemoteStreamView =>(async time gap) RenderElement generated => element disposed => onDisposeRemoteStreamView
    // Element disposed could happen during async time gap, which still cause leaks for unused renderElement.
    // Need to do an entire cleanup when remoteTile gets disposed and make sure element gets correctly disposed
    useEffect(() => {
      return () => {
        // TODO: Remove if condition when we isolate dispose behavior for screen share
        if (!isScreenSharingOn) {
          onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
        }
      };
    }, [onDisposeRemoteStreamView, userId, isScreenSharingOn]);

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
      />
    );
  }
);
