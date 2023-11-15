// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect } from 'react';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '../../types';
import { _formatString } from '@internal/acs-ui-common';

/**
 * A memoized version of VideoTile for rendering the remote screen share stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemotePPTLive = React.memo(
  (props: {
    userId: string;
    displayName?: string;
    onCreateRemoteStreamView?: (
      userId: string,
      options?: VideoStreamOptions
    ) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
    renderElement?: HTMLElement;
  }) => {
    const { userId, displayName, isMuted, renderElement, onCreateRemoteStreamView, onDisposeRemoteStreamView } = props;
    if (!renderElement) {
      onCreateRemoteStreamView && onCreateRemoteStreamView(userId);
    }

    useEffect(() => {
      return () => {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      };
    }, [onDisposeRemoteStreamView, userId]);

    return (
      <VideoTile
        displayName={displayName}
        isMuted={isMuted}
        renderElement={
          renderElement ? <StreamMedia videoStreamElement={renderElement} loadingState="none" /> : undefined
        }
      />
    );
  }
);
