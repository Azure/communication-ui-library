// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Label, mergeStyles, Spinner, SpinnerSize, Stack } from '@fluentui/react';
import { loadingStyle, videoStreamStyle, videoTileStyle } from './styles/ScreenShare.styles';

import {
  StreamMedia,
  VideoTile,
  CreateViewOptions,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from 'react-components';
import { LocalVideoStream, RemoteVideoStream } from 'calling-stateful-client';
import { memoizeFnAll } from '@azure/acs-calling-selector';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  disabledVideoHint,
  screenShareContainerStyle,
  stackContainerStyle,
  videoHint
} from './styles/MediaGallery.styles';

export type ScreenShareProps = {
  localParticipant?: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  onRenderView: (stream: LocalVideoStream | RemoteVideoStream, options: CreateViewOptions) => Promise<void>;
};

const memoizeAllRemoteParticipants = memoizeFnAll(
  (remoteParticipantkey: number, isAvailable?: boolean, target?: HTMLElement, displayName?: string): JSX.Element => {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={remoteParticipantkey}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            isVideoReady={isAvailable}
            videoProvider={<StreamMedia videoStreamElement={target ?? null} />}
            avatarName={displayName}
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
  const { localParticipant, remoteParticipants, onRenderView } = props;

  const participantWithScreenShare: VideoGalleryRemoteParticipant | undefined = useMemo(() => {
    return remoteParticipants.find((remoteParticipant: VideoGalleryRemoteParticipant) => {
      return remoteParticipant.screenShareStream?.isAvailable;
    });
  }, [remoteParticipants]);
  const isScreenShareAvailable =
    participantWithScreenShare &&
    participantWithScreenShare.screenShareStream &&
    participantWithScreenShare.screenShareStream.isAvailable;

  const screenShareStreamComponent = useMemo(() => {
    if (!isScreenShareAvailable) {
      return;
    }
    const screenShareStream = participantWithScreenShare?.screenShareStream;
    const isScreenShareStreamNotRendered = screenShareStream?.viewAndStatus.status === 'NotRendered';
    if (screenShareStream?.isAvailable && isScreenShareStreamNotRendered) {
      onRenderView(screenShareStream, { scalingMode: 'Fit' });
    }
    const videoStream = participantWithScreenShare?.videoStream;
    const isVideoStreamNotRendered = videoStream?.viewAndStatus.status === 'NotRendered';
    if (videoStream?.isAvailable && isVideoStreamNotRendered) {
      onRenderView(videoStream, { scalingMode: 'Crop' });
    }

    const isScreenShareStreamReady =
      screenShareStream?.viewAndStatus.status === 'Completed' && screenShareStream?.isAvailable;
    const isVideoReady = videoStream?.viewAndStatus.status === 'Completed' && videoStream?.isAvailable;
    return (
      <VideoTile
        isVideoReady={isScreenShareStreamReady}
        videoProvider={<StreamMedia videoStreamElement={screenShareStream?.viewAndStatus.view?.target ?? null} />}
        placeholderProvider={
          <div className={loadingStyle}>
            <Spinner label={`Loading ${participantWithScreenShare?.displayName}'s screen`} size={SpinnerSize.xSmall} />
          </div>
        }
        styles={{
          overlayContainer: videoStreamStyle
        }}
      >
        {videoStream && isVideoReady && (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>
              <VideoTile
                isVideoReady={isVideoReady}
                videoProvider={<StreamMedia videoStreamElement={videoStream.viewAndStatus.view?.target ?? null} />}
                styles={videoTileStyle}
              />
            </Stack>
          </Stack>
        )}
      </VideoTile>
    );
  }, [isScreenShareAvailable, onRenderView, participantWithScreenShare]);

  const layoutLocalParticipant = useMemo(() => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoStreamNotRendered = localVideoStream?.viewAndStatus.status === 'NotRendered';
    if (localVideoStream && isLocalVideoStreamNotRendered) {
      onRenderView(localVideoStream, { scalingMode: 'Crop' });
    }

    const isLocalVideoReady = localVideoStream?.viewAndStatus.status === 'Completed';
    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream?.viewAndStatus.view?.target ?? null} />}
        avatarName={localParticipant?.displayName}
        styles={videoTileStyle}
      >
        <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipant?.displayName}</Label>
      </VideoTile>
    );
  }, [localParticipant?.displayName, localParticipant?.videoStream, onRenderView]);

  const sidePanelRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants && participantWithScreenShare
        ? remoteParticipants
            .filter((remoteParticipant: VideoGalleryRemoteParticipant) => {
              return remoteParticipant.userId !== participantWithScreenShare.userId;
            })
            .map((participant: VideoGalleryRemoteParticipant, key: number) => {
              const remoteVideoStream = participant.videoStream;
              const isRemoteVideoStreamNotRendered = remoteVideoStream?.viewAndStatus.status === 'NotRendered';

              if (remoteVideoStream?.isAvailable && isRemoteVideoStreamNotRendered) {
                onRenderView(remoteVideoStream, { scalingMode: 'Crop' });
              }

              const isRemoteVideoReady =
                remoteVideoStream?.viewAndStatus.status === 'Completed' && remoteVideoStream?.isAvailable;
              return memoizedRemoteParticipantFn(
                key,
                isRemoteVideoReady,
                remoteVideoStream?.viewAndStatus.view?.target,
                participant.displayName
              );
            })
        : [];
    });
  }, [remoteParticipants, onRenderView, participantWithScreenShare]);

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
