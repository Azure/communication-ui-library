// © Microsoft Corporation. All rights reserved.

import React, { useMemo } from 'react';
import {
  connectFuncsToContext,
  StreamMedia,
  VideoTile,
  MapToLocalVideoProps,
  convertSdkRemoteParticipantToGalleryParticipant,
  ErrorHandlingProps,
  WithErrorHandling,
  VideoGallery
} from '@azure/communication-ui';
import { MapToMediaGalleryProps, MediaGalleryContainerProps } from './consumers/MapToMediaGalleryProps';
import { Label, mergeStyles, Stack } from '@fluentui/react';
import ScreenShareComponent from './ScreenShare';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  disabledVideoHint,
  // gridStyle,
  screenShareContainerStyle,
  stackContainerStyle,
  videoHint
} from './styles/MediaGallery.styles';
import { RemoteVideoTile } from './RemoteVideoTile';
import { usePropsFor } from './hooks/usePropsFor';

export const MediaGalleryComponentBase = (props: MediaGalleryContainerProps): JSX.Element => {
  const { localParticipant, remoteParticipants, screenShareStream } = props;

  const videoGalleryProps = usePropsFor(VideoGallery);

  const localVideoStream = MapToLocalVideoProps({
    stream: localParticipant.videoStream,
    scalingMode: 'Crop'
  });

  const sidePanelRemoteParticipants = useMemo(() => {
    return remoteParticipants
      .filter((remoteParticipant) => {
        const screenShareParticipant =
          screenShareStream && convertSdkRemoteParticipantToGalleryParticipant(screenShareStream.user);
        return remoteParticipant.userId !== screenShareParticipant?.userId;
      })
      .map((participant, key) => {
        const label = participant.displayName;
        const stream = participant.videoStream;

        return (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={key}>
            <Stack className={aspectRatioBoxContentStyle}>
              <RemoteVideoTile stream={stream} scalingMode={'Crop'} label={label} />
            </Stack>
          </Stack>
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteParticipants, screenShareStream]);

  const layoutLocalParticipant = useMemo(() => {
    return (
      <VideoTile
        isVideoReady={localVideoStream.isVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream.videoStreamElement} />}
        avatarName={localParticipant.displayName}
      >
        <Label className={localVideoStream.isVideoReady ? videoHint : disabledVideoHint}>
          {localParticipant.displayName}
        </Label>
      </VideoTile>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, localVideoStream]);

  return screenShareStream !== undefined ? (
    <>
      <div className={stackContainerStyle}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>{layoutLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div className={screenShareContainerStyle}>
        <ScreenShareComponent screenShareScalingMode={'Fit'} screenShareStream={screenShareStream} />
      </div>
    </>
  ) : (
    <VideoGallery {...videoGalleryProps} />
  );
};

export const MediaGalleryComponent = (props: MediaGalleryContainerProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MediaGalleryComponentBase, props);

export default connectFuncsToContext(MediaGalleryComponent, MapToMediaGalleryProps);
