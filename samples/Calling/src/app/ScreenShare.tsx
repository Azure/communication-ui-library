// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFnAll } from 'acs-ui-common';
import { mergeStyles, Spinner, SpinnerSize, Stack } from '@fluentui/react';
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
  screenShareContainerStyle,
  stackContainerStyle
} from './styles/MediaGallery.styles';
import { loadingStyle, videoStreamStyle, videoTileStyle } from './styles/ScreenShare.styles';

export type ScreenShareProps = {
  screenShareParticipant: VideoGalleryRemoteParticipant | undefined;
  localParticipant?: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  onCreateLocalStreamView?: () => Promise<void>;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
};

const memoizeAllRemoteParticipants = memoizeFnAll(
  (userId: string, isReady?: boolean, renderElement?: HTMLElement, displayName?: string): JSX.Element => {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={userId}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            isVideoReady={isReady}
            renderElement={<StreamMedia videoStreamElement={renderElement ?? null} />}
            displayName={displayName}
            styles={videoTileStyle}
          />
        </Stack>
      </Stack>
    );
  }
);

export const ScreenShare = (props: ScreenShareProps): JSX.Element => {
  const {
    screenShareParticipant,
    localParticipant,
    remoteParticipants,
    onCreateRemoteStreamView,
    onCreateLocalStreamView
  } = props;

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
      screenShareParticipant &&
        onCreateRemoteStreamView &&
        onCreateRemoteStreamView(screenShareParticipant.userId, {
          scalingMode: 'Fit'
        });
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }

    const isScreenShareStreamReady =
      screenShareStream?.renderStatus === 'Rendered' &&
      screenShareStream?.isAvailable &&
      screenShareStream?.renderElement !== undefined;
    const isVideoReady =
      videoStream?.renderStatus === 'Rendered' && videoStream?.isAvailable && videoStream?.renderElement !== undefined;
    return (
      <VideoTile
        isVideoReady={isScreenShareStreamReady}
        renderElement={<StreamMedia videoStreamElement={screenShareStream?.renderElement ?? null} />}
        placeholder={
          <div className={loadingStyle}>
            <Spinner label={`Loading ${screenShareParticipant?.displayName}'s screen`} size={SpinnerSize.xSmall} />
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
                isVideoReady={isVideoReady}
                renderElement={<StreamMedia videoStreamElement={videoStream.renderElement ?? null} />}
                styles={videoTileStyle}
              />
            </Stack>
          </Stack>
        )}
      </VideoTile>
    );
  }, [isScreenShareAvailable, onCreateRemoteStreamView, screenShareParticipant]);

  const layoutLocalParticipant = useMemo(() => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoNotRendered = localVideoStream?.renderStatus === 'NotRendered';

    if (localVideoStream && !localVideoStream?.renderElement && isLocalVideoNotRendered) {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    const isLocalVideoReady =
      localVideoStream?.renderStatus === 'Rendered' && localVideoStream?.renderElement !== undefined;
    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        renderElement={<StreamMedia videoStreamElement={localVideoStream?.renderElement ?? null} />}
        displayName={localParticipant?.displayName}
        styles={videoTileStyle}
      />
    );
  }, [localParticipant, onCreateLocalStreamView]);

  const sidePanelRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants && screenShareParticipant
        ? remoteParticipants
            .filter((remoteParticipant: VideoGalleryRemoteParticipant) => {
              return remoteParticipant.userId !== screenShareParticipant.userId;
            })
            .map((participant: VideoGalleryRemoteParticipant) => {
              const remoteVideoStream = participant.videoStream;
              const isRemoteVideoStreamNotRendered = remoteVideoStream?.renderStatus === 'NotRendered';

              if (
                remoteVideoStream?.isAvailable &&
                !remoteVideoStream?.renderElement &&
                isRemoteVideoStreamNotRendered
              ) {
                onCreateRemoteStreamView && onCreateRemoteStreamView(participant.userId);
              }

              const isRemoteVideoReady =
                remoteVideoStream?.renderStatus === 'Rendered' &&
                remoteVideoStream?.isAvailable &&
                remoteVideoStream?.renderElement !== undefined;
              return memoizedRemoteParticipantFn(
                participant.userId,
                isRemoteVideoReady,
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
            <Stack className={aspectRatioBoxContentStyle}>{layoutLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div className={screenShareContainerStyle}>{screenShareStreamComponent}</div>
    </>
  );
};
