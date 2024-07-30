// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
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
    isReceiving?: boolean;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  }) => {
    const { localParticipant, renderElement, isReceiving, onCreateLocalStreamView } = props;
    const locale = useLocale();
    if (!renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    if (!localParticipant || !localParticipant.isScreenSharingOn) {
      return null;
    }

    const displayName = !localParticipant?.displayName
      ? locale.strings.videoGallery.displayNamePlaceholder
      : localParticipant?.displayName;

    const loadingMessage = displayName
      ? _formatString(locale.strings.videoGallery.screenShareLoadingMessage, {
          participant: displayName
        })
      : '';

    return (
      <VideoTile
        displayName={displayName}
        isMuted={localParticipant?.isMuted}
        renderElement={
          renderElement ? (
            <StreamMedia videoStreamElement={renderElement} loadingState={isReceiving === false ? 'loading' : 'none'} />
          ) : undefined
        }
        onRenderPlaceholder={() => <LoadingSpinner loadingMessage={loadingMessage} />}
      />
    );
  }
);
