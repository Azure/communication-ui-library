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
  (userId: string, isMuted?: boolean, renderElement?: HTMLElement, displayName?: string): JSX.Element => {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={userId}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            styles={stackContainerParticipantVideoStyles}
            userId={userId}
            renderElement={renderElement ? <StreamMedia videoStreamElement={renderElement} /> : undefined}
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
        isMuted={screenShareParticipant?.isMuted}
        renderElement={
          screenShareStream?.renderElement ? (
            <StreamMedia videoStreamElement={screenShareStream?.renderElement} />
          ) : undefined
        }
        onRenderPlaceholder={onRenderPlaceholder}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      >
        {videoStream && videoStream.isAvailable && videoStream.renderElement && (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>
              <VideoTile renderElement={<StreamMedia videoStreamElement={videoStream.renderElement ?? null} />} />
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
        isMuted={localParticipant?.isMuted}
        renderElement={
          localVideoStream?.renderElement ? (
            <StreamMedia videoStreamElement={localVideoStream?.renderElement} />
          ) : undefined
        }
        displayName={localParticipant?.displayName}
      />
    );
  }, [localParticipant, localVideoStream, onCreateLocalStreamView]);

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
                participant.isMuted,
                remoteVideoStream?.renderElement,
                participant.displayName
              );
            })
        : [];
    });
  }, [remoteParticipants, onCreateRemoteStreamView, screenShareParticipant]);

  return (
    <Stack horizontal verticalFill>
      <Stack.Item className={stackContainerStyle}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>{sidePanelLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </Stack.Item>
      <Stack.Item className={screenShareContainerStyle}>{screenShareStreamComponent}</Stack.Item>
    </Stack>
  );
};
