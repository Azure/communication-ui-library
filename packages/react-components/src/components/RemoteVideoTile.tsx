// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, mergeStyles } from '@fluentui/react';
import React, { CSSProperties, useEffect, useMemo } from 'react';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';
import { VideoStreamOptions, OnRenderAvatarCallback } from '../types';
import { gridStyle } from './styles/VideoGallery.styles';

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
    renderElement?: HTMLElement;
    displayName?: string;
    remoteVideoViewOption?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
    style?: CSSProperties;
  }) => {
    const {
      isAvailable,
      isMuted,
      isSpeaking,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOption,
      renderElement,
      userId,
      displayName,
      onRenderAvatar,
      showMuteIndicator
    } = props;

    useEffect(() => {
      if (isAvailable && !renderElement) {
        onCreateRemoteStreamView && onCreateRemoteStreamView(userId, remoteVideoViewOption);
      }
      if (!isAvailable) {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      }
    }, [
      isAvailable,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOption,
      renderElement,
      userId
    ]);

    useEffect(() => {
      return () => {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      };
    }, [onDisposeRemoteStreamView, userId]);

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
      <Stack className={mergeStyles(gridStyle)} key={userId} grow style={props.style}>
        <VideoTile
          userId={userId}
          renderElement={renderVideoStreamElement}
          displayName={displayName}
          onRenderPlaceholder={onRenderAvatar}
          isMuted={isMuted}
          isSpeaking={isSpeaking}
          showMuteIndicator={showMuteIndicator}
        />
      </Stack>
    );
  }
);
