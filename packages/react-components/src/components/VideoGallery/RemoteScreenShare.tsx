// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useLocale } from '../../localization';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '../../types';
import { loadingStyle } from './styles/RemoteScreenShare.styles';
import { _formatString } from '@internal/acs-ui-common';

/**
 * A memoized version of VideoTile for rendering the remote screen share stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemoteScreenShare = React.memo(
  (props: {
    userId: string;
    displayName?: string;
    onCreateRemoteStreamView?: (
      userId: string,
      options?: VideoStreamOptions
    ) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isReceiving?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
    renderElement?: HTMLElement;
  }) => {
    const {
      userId,
      displayName,
      isMuted,
      renderElement,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      isReceiving
    } = props;
    const locale = useLocale();

    if (!renderElement) {
      onCreateRemoteStreamView && onCreateRemoteStreamView(userId);
    }

    useEffect(() => {
      return () => {
        // TODO: Isolate disposing behaviors for screenShare and videoStream
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      };
    }, [onDisposeRemoteStreamView, userId]);

    const loadingMessage = displayName
      ? _formatString(locale.strings.videoGallery.screenShareLoadingMessage, {
          participant: displayName
        })
      : '';

    return (
      <VideoTile
        displayName={displayName}
        isMuted={isMuted}
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

const LoadingSpinner = (props: { loadingMessage: string }): JSX.Element => {
  return (
    <Stack verticalAlign="center" className={loadingStyle}>
      <Spinner label={props.loadingMessage} size={SpinnerSize.xSmall} aria-live={'assertive'} />
    </Stack>
  );
};
