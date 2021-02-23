// © Microsoft Corporation. All rights reserved.

import React, { useMemo } from 'react';
import { connectFuncsToContext } from '../../consumers/ConnectContext';
import { MapToMediaGalleryProps, MediaGalleryContainerProps } from './consumers/MapToMediaGalleryProps';
import { GridLayoutComponent } from '../../components/GridLayout';
import { convertSdkRemoteParticipantToGalleryParticipant } from '../../utils';
import { MediaGalleryTileComponent } from '../../components';
import { MapToRemoteVideoProps, MapToLocalVideoProps } from '../..';
import { mergeStyles, Stack } from '@fluentui/react';
import ScreenShareComponent from './ScreenShare';
import { gridStyle } from './styles/MediaGallery.styles';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';

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
          <Stack className={gridStyle} key={key} grow>
            <RemoteGridLayoutTileWithData label={label} stream={stream} scalingMode={'Crop'} />
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
        <Stack className={gridStyle} key={key} grow>
          <RemoteGridLayoutTileWithData label={label} stream={stream} scalingMode={'Crop'} />
        </Stack>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteParticipants]);

  const layoutLocalParticipant = useMemo(() => {
    return (
      <Stack className={gridStyle} grow>
        <LocalGridLayoutTileWithData
          label={localParticipant.displayName}
          stream={localParticipant.videoStream}
          scalingMode={'Crop'}
        />
      </Stack>
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
        <Stack grow className={mergeStyles({ height: '100%' })}>
          {layoutLocalParticipant}
          {sidePanelRemoteParticipants}
        </Stack>
      </div>
      <div
        className={mergeStyles({
          height: '100%',
          width: '75%'
        })}
      >
        <ScreenShareComponent screenShareScalingMode={'Fit'} screenShareStream={screenShareStream} />
      </div>
    </>
  ) : (
    <GridLayoutComponent>
      {layoutLocalParticipant}
      {gridLayoutRemoteParticipants}
    </GridLayoutComponent>
  );
};

export const MediaGalleryComponent = (props: MediaGalleryContainerProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MediaGalleryComponentBase, props);

export default connectFuncsToContext(MediaGalleryComponent, MapToMediaGalleryProps);
