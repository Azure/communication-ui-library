// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFnAll } from '@azure/acs-calling-selector';
import { Label, mergeStyles, Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import {
  StreamMedia,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  VideoTile
} from 'react-components';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  disabledVideoHint,
  screenShareContainerStyle,
  stackContainerStyle,
  videoHint
} from './styles/MediaGallery.styles';
import { loadingStyle, videoStreamStyle, videoTileStyle } from './styles/ScreenShare.styles';

export type ScreenShareProps = {
  localParticipant?: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  participantWithScreenShare: VideoGalleryRemoteParticipant;
  onCreateLocalStreamView?: () => Promise<void>;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
};

const memoizeAllRemoteParticipants = memoizeFnAll(
  (userId: string, isAvailable?: boolean, renderElement?: HTMLElement, displayName?: string): JSX.Element => {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={userId}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            isVideoReady={isAvailable}
            renderElement={<StreamMedia videoStreamElement={renderElement ?? null} />}
            displayName={displayName}
            styles={videoTileStyle}
          >
            <Label className={isAvailable ? videoHint : disabledVideoHint}>{displayName}</Label>
          </VideoTile>
        </Stack>
      </Stack>
    );
  }
);

export const ScreenShare = (props: ScreenShareProps): JSX.Element => {
  const {
    localParticipant,
    remoteParticipants,
    onCreateRemoteStreamView,
    onCreateLocalStreamView,
    participantWithScreenShare
  } = props;

  const localVideoStream = localParticipant?.videoStream;
  const isLocalVideoReady = localVideoStream?.renderElement !== undefined;
  const isScreenShareAvailable =
    participantWithScreenShare &&
    participantWithScreenShare.screenShareStream &&
    participantWithScreenShare.screenShareStream.isAvailable;

  const screenShareStreamComponent = useMemo(() => {
    if (!isScreenShareAvailable) {
      return;
    }
    const screenShareStream = participantWithScreenShare?.screenShareStream;
    const videoStream = participantWithScreenShare?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.renderElement) {
      participantWithScreenShare &&
        onCreateRemoteStreamView &&
        onCreateRemoteStreamView(participantWithScreenShare.userId, {
          scalingMode: 'Fit'
        });
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      participantWithScreenShare &&
        onCreateRemoteStreamView &&
        onCreateRemoteStreamView(participantWithScreenShare.userId);
    }

    return (
      <VideoTile
        isVideoReady={screenShareStream?.isAvailable}
        renderElement={<StreamMedia videoStreamElement={screenShareStream?.renderElement ?? null} />}
        placeholderProvider={
          <div className={loadingStyle}>
            <Spinner label={`Loading ${participantWithScreenShare?.displayName}'s screen`} size={SpinnerSize.xSmall} />
          </div>
        }
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
                styles={videoTileStyle}
              />
            </Stack>
          </Stack>
        )}
      </VideoTile>
    );
  }, [isScreenShareAvailable, onCreateRemoteStreamView, participantWithScreenShare]);

  const layoutLocalParticipant = useMemo(() => {
    if (localVideoStream && !localVideoStream?.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        renderElement={<StreamMedia videoStreamElement={localVideoStream?.renderElement ?? null} />}
        displayName={localParticipant?.displayName}
        styles={videoTileStyle}
      >
        <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipant?.displayName}</Label>
      </VideoTile>
    );
  }, [isLocalVideoReady, localParticipant, localVideoStream, onCreateLocalStreamView]);

  const sidePanelRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants && participantWithScreenShare
        ? remoteParticipants
            .filter((remoteParticipant: VideoGalleryRemoteParticipant) => {
              return remoteParticipant.userId !== participantWithScreenShare.userId;
            })
            .map((participant: VideoGalleryRemoteParticipant) => {
              const remoteVideoStream = participant.videoStream;

              if (remoteVideoStream?.isAvailable && !remoteVideoStream?.renderElement) {
                onCreateRemoteStreamView && onCreateRemoteStreamView(participant.userId);
              }

              return memoizedRemoteParticipantFn(
                participant.userId,
                remoteVideoStream?.isAvailable,
                remoteVideoStream?.renderElement,
                participant.displayName
              );
            })
        : [];
    });
  }, [remoteParticipants, participantWithScreenShare, onCreateRemoteStreamView]);

  return (
    <>
      <div className={stackContainerStyle}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>{layoutLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div className={screenShareContainerStyle}>{screenShareStreamComponent}</div>
    </>
  );
};
