// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
import { VideoStreamOptions, VideoGalleryRemoteParticipant } from '../../types';
import { videoWithNoRoundedBorderStyle, loadingStyle } from './styles/RemoteScreenShare.styles';
import { _formatString } from '@internal/acs-ui-common';

/**
 * All strings that may be shown on the UI in the {@link RemoteScreenShare}.
 *
 * @public
 */
export interface RemoteScreenShareStrings {
  /** String to show when remote screen share stream is loading */
  screenShareLoadingMessage: string;
}

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
    const locale = useLocale();

    const screenShareStream = screenShareParticipant?.screenShareStream;
    const videoStream = screenShareParticipant?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }

    const videoStyles = screenShareParticipant?.isSpeaking ? videoWithNoRoundedBorderStyle : {};

    const loadingMessage = screenShareParticipant?.displayName
      ? _formatString(locale.strings.remoteScreenShare.screenShareLoadingMessage, {
          participant: screenShareParticipant?.displayName
        })
      : '';

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
        onRenderPlaceholder={() => <LoadingSpinner loadingMessage={loadingMessage} />}
      />
    );
  }
);

const LoadingSpinner = (props: { loadingMessage: string }): JSX.Element => {
  return (
    <Stack verticalAlign="center" className={loadingStyle}>
      <Spinner label={props.loadingMessage} size={SpinnerSize.xSmall} />
    </Stack>
  );
};
