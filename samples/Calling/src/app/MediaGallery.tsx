// © Microsoft Corporation. All rights reserved.

import React, { useMemo } from 'react';
import { connectFuncsToContext } from '@azure/communication-ui';
import { MapToMediaGalleryProps, MediaGalleryContainerProps } from './consumers/MapToMediaGalleryProps';
import { GridLayoutComponent } from '@azure/communication-ui';
import { convertSdkRemoteParticipantToGalleryParticipant } from '@azure/communication-ui';
import { MediaGalleryTileComponent } from '@azure/communication-ui';
import { MapToRemoteVideoProps, MapToLocalVideoProps } from '@azure/communication-ui';
import { mergeStyles, Stack } from '@fluentui/react';
import ScreenShareComponent from './ScreenShare';
import { aspectRatioBoxContentStyle, aspectRatioBoxStyle, gridStyle } from './styles/MediaGallery.styles';
import { ErrorHandlingProps, WithErrorHandling } from '@azure/communication-ui';

export const MediaGalleryComponentBase = (props: MediaGalleryContainerProps): JSX.Element => {
  const { localParticipant, remoteParticipants, screenShareStream } = props;

  const RemoteGridLayoutTileWithData = connectFuncsToContext(MediaGalleryTileComponent, MapToRemoteVideoProps);

  const LocalGridLayoutTileWithData = connectFuncsToContext(MediaGalleryTileComponent, MapToLocalVideoProps);

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
          <Stack horizontalAlign="center" verticalAlign="center" className={mergeStyles(aspectRatioBoxStyle)} key={key}>
            <Stack className={mergeStyles(aspectRatioBoxContentStyle)}>
              <RemoteGridLayoutTileWithData label={label} avatarName={label} stream={stream} scalingMode={'Crop'} />
            </Stack>
          </Stack>
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteParticipants, screenShareStream]);

  const gridLayoutRemoteParticipants = useMemo(() => {
    return remoteParticipants.map((participant, key) => {
      const label = participant.displayName;
      const stream = participant.videoStream;

      return (
        <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} key={key} grow>
          <RemoteGridLayoutTileWithData label={label} avatarName={label} stream={stream} scalingMode={'Crop'} />
        </Stack>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteParticipants]);

  const layoutLocalParticipant = useMemo(() => {
    return (
      <LocalGridLayoutTileWithData
        label={localParticipant.displayName}
        stream={localParticipant.videoStream}
        scalingMode={'Crop'}
        avatarName={localParticipant.displayName}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant]);

  return screenShareStream !== undefined ? (
    <>
      <div
        className={mergeStyles({
          height: '100%',
          width: '25%'
        })}
      >
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={mergeStyles(aspectRatioBoxStyle)}>
            <Stack className={mergeStyles(aspectRatioBoxContentStyle)}>{layoutLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div
        className={mergeStyles({
          height: '100%',
          width: '75%',
          position: 'relative'
        })}
      >
        <ScreenShareComponent screenShareScalingMode={'Fit'} screenShareStream={screenShareStream} />
      </div>
    </>
  ) : (
    <GridLayoutComponent>
      <Stack horizontalAlign="center" verticalAlign="center" className={mergeStyles(gridStyle)} grow>
        {layoutLocalParticipant}
      </Stack>
      {gridLayoutRemoteParticipants}
    </GridLayoutComponent>
  );
};

export const MediaGalleryComponent = (props: MediaGalleryContainerProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MediaGalleryComponentBase, props);

export default connectFuncsToContext(MediaGalleryComponent, MapToMediaGalleryProps);
