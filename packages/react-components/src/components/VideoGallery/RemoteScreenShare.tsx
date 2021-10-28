// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';
import { VideoStreamOptions, VideoGalleryRemoteParticipant } from '../../types';
import { videoWithNoRoundedBorderStyle, videoStreamStyle, loadingStyle } from './styles/RemoteScreenShare.styles';
import { formatString } from '../../localization/localizationUtils';

/**
 * All strings that may be shown on the UI in the {@link RemoteScreenShare}.
 *
 * @public
 */
export interface RemoteScreenShareStrings {
  /** String to show when remote screen share stream is loading */
  loadingMessage: string;
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

    const loadingMessage = screenShareParticipant?.displayName
      ? formatString(locale.strings.remoteScreenShare.loadingMessage, {
          participant: screenShareParticipant?.displayName
        })
      : undefined;
    const spinner = (
      <div className={loadingStyle}>
        <Spinner label={loadingMessage} size={SpinnerSize.xSmall} />
      </div>
    );

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
        onRenderPlaceholder={() => spinner}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      />
    );
  }
);
