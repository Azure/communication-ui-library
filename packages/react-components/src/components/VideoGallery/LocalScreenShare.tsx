// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect } from 'react';
import { useLocale } from '../../localization';
import { CreateVideoStreamViewResult, VideoGalleryLocalParticipant, VideoStreamOptions } from '../../types';
import { VideoTile } from '../VideoTile';
import { StreamMedia } from '../StreamMedia';
import { LoadingSpinner } from './RemoteScreenShare';
import { _formatString } from '@internal/acs-ui-common';

/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const LocalScreenShare = React.memo(
  (props: {
    localParticipant: VideoGalleryLocalParticipant;
    renderElement?: HTMLElement;
    isAvailable?: boolean;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeLocalScreenShareStreamView?: () => Promise<void>;
  }) => {
    const {
      localParticipant,
      renderElement,
      isAvailable,
      onCreateLocalStreamView,
      onDisposeLocalScreenShareStreamView
    } = props;
    const locale = useLocale();
    if (!renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    useEffect(() => {
      return () => {
        // TODO: Isolate disposing behaviors for screenShare and videoStream
        onDisposeLocalScreenShareStreamView && onDisposeLocalScreenShareStreamView();
      };
    }, [onDisposeLocalScreenShareStreamView]);

    if (!localParticipant || !localParticipant.isScreenSharingOn) {
      return null;
    }

    const displayName = !localParticipant?.displayName
      ? locale.strings.videoGallery.displayNamePlaceholder
      : localParticipant?.displayName;

    const loadingMessage = locale.strings.videoGallery.localScreenShareLoadingMessage;

    return (
      <VideoTile
        displayName={displayName}
        isMuted={localParticipant?.isMuted}
        renderElement={
          renderElement ? (
            <StreamMedia videoStreamElement={renderElement} loadingState={isAvailable === false ? 'loading' : 'none'} />
          ) : undefined
        }
        onRenderPlaceholder={() => <LoadingSpinner loadingMessage={loadingMessage} />}
        /* @conditional-compile-remove(media-access) */
        mediaAccess={localParticipant.mediaAccess}
      />
    );
  }
);
