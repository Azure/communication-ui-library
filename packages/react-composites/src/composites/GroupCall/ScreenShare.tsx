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
  const { localParticipant, remoteParticipants, onRenderView } = props;

  const localVideoStream = localParticipant?.videoStream;
  const isLocalVideoReady = localVideoStream?.videoStreamRendererView !== undefined;
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
    const videoStream = participantWithScreenShare?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.videoStreamRendererView) {
      onRenderView(screenShareStream, {
        scalingMode: 'Fit'
      }).catch((e) => {
        // Since we are calling this async and not awaiting, there could be an error from try to start render of a
        // stream that is already rendered. The StatefulClient will handle this so we can ignore this error in the UI
        // but ideally we should make this await and avoid duplicate calls.
        console.warn(e.message);
      });
    }
    if (videoStream?.isAvailable && !videoStream?.videoStreamRendererView) {
      onRenderView(videoStream, {
        scalingMode: 'Crop'
      }).catch((e) => {
        // Since we are calling this async and not awaiting, there could be an error from try to start render of a
        // stream that is already rendered. The StatefulClient will handle this so we can ignore this error in the UI
        // but ideally we should make this await and avoid duplicate calls.
        console.warn(e.message);
      });
    }

    return (
      <VideoTile
        isVideoReady={screenShareStream?.isAvailable}
        videoProvider={<StreamMedia videoStreamElement={screenShareStream?.videoStreamRendererView?.target ?? null} />}
        placeholderProvider={
          <div className={loadingStyle}>
            <Spinner label={`Loading ${participantWithScreenShare?.displayName}'s screen`} size={SpinnerSize.xSmall} />
          </div>
        }
        styles={{
          overlayContainer: videoStreamStyle
        }}
      >
        {videoStream && videoStream.isAvailable && videoStream.videoStreamRendererView && (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>
              <VideoTile
                isVideoReady={videoStream.isAvailable}
                videoProvider={<StreamMedia videoStreamElement={videoStream.videoStreamRendererView.target ?? null} />}
                styles={videoTileStyle}
              />
            </Stack>
          </Stack>
        )}
      </VideoTile>
    );
  }, [isScreenShareAvailable, onRenderView, participantWithScreenShare]);

  const layoutLocalParticipant = useMemo(() => {
    if (localVideoStream && !localVideoStream?.videoStreamRendererView) {
      onRenderView(localVideoStream, {
        scalingMode: 'Crop'
      }).catch((e) => {
        // Since we are calling this async and not awaiting, there could be an error from try to start render of a
        // stream that is already rendered. The StatefulClient will handle this so we can ignore this error in the UI
        // but ideally we should make this await and avoid duplicate calls.
        console.warn(e.message);
      });
    }

    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream?.videoStreamRendererView?.target ?? null} />}
        displayName={localParticipant?.displayName}
        styles={videoTileStyle}
      >
        <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipant?.displayName}</Label>
      </VideoTile>
    );
  }, [isLocalVideoReady, localParticipant?.displayName, localVideoStream, onRenderView]);

  const sidePanelRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants && participantWithScreenShare
        ? remoteParticipants
            .filter((remoteParticipant: VideoGalleryRemoteParticipant) => {
              return remoteParticipant.userId !== participantWithScreenShare.userId;
            })
            .map((participant: VideoGalleryRemoteParticipant, key: number) => {
              const remoteVideoStream = participant.videoStream;

              if (remoteVideoStream?.isAvailable && !remoteVideoStream?.videoStreamRendererView) {
                onRenderView(remoteVideoStream, {
                  scalingMode: 'Crop'
                }).catch((e: Error) => {
                  // Since we are calling this async and not awaiting, there could be an error from try to start render
                  // of a stream that is already rendered. The StatefulClient will handle this so we can ignore this
                  // error in the UI but ideally we should make this await and avoid duplicate calls.
                  console.warn(e.message);
                });
              }

              return memoizedRemoteParticipantFn(
                key,
                remoteVideoStream?.isAvailable,
                remoteVideoStream?.videoStreamRendererView?.target,
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
