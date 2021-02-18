// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Stack } from '@fluentui/react';
import { MediaGalleryTileComponent as MediaGalleryTile, MediaGalleryTileProps } from '../components/MediaGalleryTile';
import {
  localMediaGalleryTileStyle,
  mediaGallery1To1Style,
  remoteMediaGalleryTileStyle
} from './styles/MediaGallery1To1.styles';
import { ScalingMode } from '@azure/communication-calling';
import {
  connectFuncsToContext,
  LocalVideoContainerOwnProps,
  VideoContainerProps,
  MapToLocalVideoProps,
  MapToRemoteVideoProps,
  RemoteVideoContainerOwnProps
} from '../consumers';
import { GalleryParticipant } from '../types/GalleryParticipant';
import { MapToMediaGallery1To1Props, MediaGallery1To1ContainerProps } from '../consumers/MapToMediaGallery1To1Props';

export interface MediaGallery1To1Props extends MediaGallery1To1ContainerProps {
  /** Determines the remote participant in the media gallery. */
  remoteParticipant: GalleryParticipant | undefined;
  /** Determines the local participant label/avatar. */
  localParticipantName?: string;
  /** Show local participant label */
  showLocalParticipantName?: boolean;
  /** Optional property to set the local media gallery tile scaling mode. */
  localVideoScalingMode?: ScalingMode;
  /** Optional property for inverting(mirroring) local video */
  localVideoInverted?: boolean;
  /** Optional property to set the remote media gallery tile scaling mode. */
  remoteVideoScalingMode?: ScalingMode;
  /** Optional property to set the aria label of the remote media gallery tile if there is no available stream. */
  noRemoteVideoAvailableAriaLabel?: string;
  /** Optional property to set the aria label of the local media gallery tile if there is no available stream. */
  noLocalVideoAvailableAriaLabel?: string;
  /** Optional connection function to map the ACS stream data to the local media gallery tile. This is only needed
   * if MapLocalVideoContextToProps from ACS data layer is not suited for you.
   */
  connectLocalMediaGalleryTileWithData?: (ownProps: LocalVideoContainerOwnProps) => VideoContainerProps;
  /** Optional connection function to map the ACS stream data to the remote media gallery tile. This is only needed
   * if MapRemoteVideoContextToProps from ACS data layer is not suited for you.
   */
  connectRemoteMediaGalleryTileWithData?: (ownProps: RemoteVideoContainerOwnProps) => VideoContainerProps;
  /** Optional callback to render local media gallery tile. */
  onRenderLocalMediaGalleryTile?: (props: MediaGalleryTileProps) => JSX.Element;
  /** Optional callback to render remote media gallery tile. */
  onRenderRemoteMediaGalleryTile?: (props: MediaGalleryTileProps) => JSX.Element;
}

export const MediaGallery1To1Component = (props: MediaGallery1To1Props): JSX.Element => {
  const {
    localParticipantName,
    showLocalParticipantName,
    onRenderLocalMediaGalleryTile,
    onRenderRemoteMediaGalleryTile,
    remoteVideoScalingMode,
    localVideoScalingMode,
    noRemoteVideoAvailableAriaLabel,
    noLocalVideoAvailableAriaLabel,
    connectLocalMediaGalleryTileWithData,
    connectRemoteMediaGalleryTileWithData,
    remoteParticipant,
    localVideoInverted,
    localVideoStream
  } = props;

  const remoteParticipantName = remoteParticipant?.displayName;
  const stream = remoteParticipant?.videoStream;

  const mediaGalleryRemoteParticipant: JSX.Element = (
    <Stack className={remoteMediaGalleryTileStyle}>
      {connectFuncsToContext(
        onRenderRemoteMediaGalleryTile ?? MediaGalleryTile,
        connectRemoteMediaGalleryTileWithData ?? MapToRemoteVideoProps
      )({
        label: remoteParticipantName,
        avatarName: remoteParticipantName,
        stream: stream,
        scalingMode: remoteVideoScalingMode,
        noVideoAvailableAriaLabel: noRemoteVideoAvailableAriaLabel
      })}
    </Stack>
  );

  const mediaGalleryLocalParticipant: JSX.Element = (
    <Stack.Item align="end">
      <Stack className={localMediaGalleryTileStyle}>
        {connectFuncsToContext(
          onRenderLocalMediaGalleryTile ?? MediaGalleryTile,
          connectLocalMediaGalleryTileWithData ?? MapToLocalVideoProps
        )({
          label: showLocalParticipantName ? localParticipantName : undefined,
          avatarName: localParticipantName,
          stream: localVideoStream,
          scalingMode: localVideoScalingMode,
          noVideoAvailableAriaLabel: noLocalVideoAvailableAriaLabel,
          invertVideo: localVideoInverted
        })}
      </Stack>
    </Stack.Item>
  );

  return (
    <Stack className={mediaGallery1To1Style}>
      {mediaGalleryRemoteParticipant}
      {mediaGalleryLocalParticipant}
    </Stack>
  );
};

export default connectFuncsToContext(MediaGallery1To1Component, MapToMediaGallery1To1Props);
