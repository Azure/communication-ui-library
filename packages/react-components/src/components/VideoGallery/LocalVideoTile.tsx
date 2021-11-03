// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { VideoTile } from '../VideoTile';
import { StreamMedia } from '../StreamMedia';
import { OnRenderAvatarCallback, VideoGalleryLocalParticipant, VideoStreamOptions } from '../..';

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

/**
 * A memoized version of VideoTile for rendering the remote screen share stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 *
 * @public
 */
export const LocalVideoTile = React.memo(
  (props: {
    participant?: VideoGalleryLocalParticipant;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
    onRenderAvatar?: OnRenderAvatarCallback;
  }) => {
    const { participant, onCreateLocalStreamView, onRenderAvatar } = props;

    const localVideoStream = participant?.videoStream;

    if (localVideoStream && !localVideoStream.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
    }

    return (
      <VideoTile
        userId={participant?.userId}
        renderElement={
          localVideoStream?.renderElement ? (
            <StreamMedia videoStreamElement={localVideoStream.renderElement} />
          ) : undefined
        }
        displayName={participant?.displayName}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={participant?.isMuted}
      />
    );
  }
);
