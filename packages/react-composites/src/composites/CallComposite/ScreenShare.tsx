// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFnAll } from '@internal/acs-ui-common';
import { mergeStyles, Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import {
  PlaceholderProps,
  StreamMedia,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  VideoTile
} from '@internal/react-components';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  screenShareContainerStyle,
  stackContainerStyle,
  stackContainerParticipantVideoStyles
} from './styles/MediaGallery.styles';
import { loadingStyle, videoStreamStyle } from './styles/ScreenShare.styles';

export type ScreenShareProps = {
  screenShareParticipant: VideoGalleryRemoteParticipant | undefined;
  localParticipant?: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  onCreateLocalStreamView?: () => Promise<void>;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
};

const memoizeAllRemoteParticipants = memoizeFnAll(
  (
    userId: string,
    isAvailable?: boolean,
    isMuted?: boolean,
    renderElement?: HTMLElement,
    displayName?: string
  ): JSX.Element => {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={userId}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            styles={stackContainerParticipantVideoStyles}
            userId={userId}
            isVideoReady={isAvailable}
            renderElement={<StreamMedia videoStreamElement={renderElement ?? null} />}
            displayName={displayName}
            isMuted={isMuted}
          />
        </Stack>
      </Stack>
    );
  }
);

// A non-undefined display name is needed for this render, and that is coming from VideoTile props below
const onRenderPlaceholder = (props: PlaceholderProps): JSX.Element => (
  <div className={loadingStyle}>
    <Spinner label={`Loading ${props.displayName}'s screen`} size={SpinnerSize.xSmall} />
  </div>
);

export const ScreenShare = (props: ScreenShareProps): JSX.Element => {
  const {
    screenShareParticipant,
    localParticipant,
    remoteParticipants,
    onCreateRemoteStreamView,
    onCreateLocalStreamView
  } = props;

  const localVideoStream = localParticipant?.videoStream;
  const isLocalVideoReady = localVideoStream?.renderElement !== undefined;
  const isScreenShareAvailable =
    screenShareParticipant &&
    screenShareParticipant.screenShareStream &&
    screenShareParticipant.screenShareStream.isAvailable;

  const screenShareStreamComponent = useMemo(() => {
    if (!isScreenShareAvailable) {
      return;
    }
    const screenShareStream = screenShareParticipant?.screenShareStream;
    const videoStream = screenShareParticipant?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }

    return (
      <VideoTile
        displayName={screenShareParticipant?.displayName}
        isVideoReady={screenShareStream?.isAvailable}
        isMuted={screenShareParticipant?.isMuted}
        renderElement={<StreamMedia videoStreamElement={screenShareStream?.renderElement ?? null} />}
        onRenderPlaceholder={onRenderPlaceholder}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      >
        {videoStream && videoStream.isAvailable && videoStream.renderElement && (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>
              <VideoTile
                isVideoReady={videoStream.isAvailable}
                renderElement={<StreamMedia videoStreamElement={videoStream.renderElement ?? null} />}
              />
            </Stack>
          </Stack>
        )}
      </VideoTile>
    );
  }, [isScreenShareAvailable, onCreateRemoteStreamView, screenShareParticipant]);

  const sidePanelLocalParticipant = useMemo(() => {
    if (localVideoStream && !localVideoStream?.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    return (
      <VideoTile
        styles={stackContainerParticipantVideoStyles}
        isVideoReady={isLocalVideoReady}
        isMuted={localParticipant?.isMuted}
        renderElement={<StreamMedia videoStreamElement={localVideoStream?.renderElement ?? null} />}
        displayName={localParticipant?.displayName}
      />
    );
  }, [isLocalVideoReady, localParticipant, localVideoStream, onCreateLocalStreamView]);

  const sidePanelRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants && screenShareParticipant
        ? remoteParticipants
            .filter((remoteParticipant: VideoGalleryRemoteParticipant) => {
              return remoteParticipant.userId !== screenShareParticipant.userId;
            })
            .map((participant: VideoGalleryRemoteParticipant) => {
              const remoteVideoStream = participant.videoStream;

              if (remoteVideoStream?.isAvailable && !remoteVideoStream?.renderElement) {
                onCreateRemoteStreamView && onCreateRemoteStreamView(participant.userId);
              }

              return memoizedRemoteParticipantFn(
                participant.userId,
                remoteVideoStream?.isAvailable,
                participant.isMuted,
                remoteVideoStream?.renderElement,
                participant.displayName
              );
            })
        : [];
    });
  }, [remoteParticipants, onCreateRemoteStreamView, screenShareParticipant]);

  return (
    <>
      <div className={stackContainerStyle}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>{sidePanelLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div className={screenShareContainerStyle}>{screenShareStreamComponent}</div>
    </>
  );
};
