// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
import { VideoStreamOptions, VideoGalleryRemoteParticipant, OnRenderAvatarCallback } from '../../types';
import { videoWithNoRoundedBorderStyle, videoStreamStyle, loadingStyle } from './styles/RemoteScreenShare.styles';

/**
 * A memoized version of VideoTile for rendering the remote screen share stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemoteScreenShare = React.memo(
  (props: {
    screenShareParticipant?: VideoGalleryRemoteParticipant;
    onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  }) => {
    const { onCreateRemoteStreamView, screenShareParticipant } = props;
    const isScreenShareAvailable =
      screenShareParticipant &&
      screenShareParticipant.screenShareStream &&
      screenShareParticipant.screenShareStream.isAvailable;

    if (!isScreenShareAvailable) {
      return null;
    }
    const screenShareStream = screenShareParticipant?.screenShareStream;
    const videoStream = screenShareParticipant?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }

    const videoStyles = screenShareParticipant?.isSpeaking ? videoWithNoRoundedBorderStyle : {};

    return (
      <VideoTile
        displayName={screenShareParticipant?.displayName}
        isMuted={screenShareParticipant?.isMuted}
        isSpeaking={screenShareParticipant?.isSpeaking}
        renderElement={
          screenShareStream?.renderElement ? (
            <StreamMedia styles={videoStyles} videoStreamElement={screenShareStream?.renderElement} />
          ) : undefined
        }
        onRenderPlaceholder={onRenderPlaceholder}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      />
    );
  }
);

// A non-undefined display name is needed for this render, and that is coming from VideoTile props below
const onRenderPlaceholder: OnRenderAvatarCallback = (userId, options): JSX.Element => (
  <div className={loadingStyle}>
    <Spinner label={`Loading ${options?.text}'s screen`} size={SpinnerSize.xSmall} />
  </div>
);
