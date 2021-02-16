// © Microsoft Corporation. All rights reserved.

import React, { useMemo, useState } from 'react';
import { mediaGalleryGridStyle, mediaGalleryStyle } from './styles/MediaGallery.styles';
import { MediaGalleryTileComponent, MediaGalleryTileProps } from './MediaGalleryTile';
import { ScalingMode } from '@azure/communication-calling';
import {
  connectFuncsToContext,
  MapToMediaGalleryProps,
  MediaGalleryContainerProps,
  LocalVideoContainerOwnProps,
  MapToLocalVideoProps,
  MapToRemoteVideoProps,
  RemoteVideoContainerOwnProps,
  VideoContainerProps
} from '../consumers';

export interface MediaGalleryProps extends MediaGalleryContainerProps {
  /** Optional property to set the local media gallery tile scaling mode. */
  localVideoScalingMode?: ScalingMode;
  /** Optional property to set the remote media gallery tile scaling mode. */
  remoteVideoScalingMode?: ScalingMode;
  /** Optional property to set the aria label of the remote media gallery tile if there is no available stream. */
  noRemoteVideoAvailableAriaLabel?: string;
  /** Optional property to set the aria label of the local media gallery tile if there is no available stream. */
  noLocalVideoAvailableAriaLabel?: string;
  /** Optional connection function to map the ACS stream data to the local media gallery tile. This is only needed
   * if MapToLocalVideoProps from ACS data layer is not suited for you.
   */
  connectLocalMediaGalleryTileWithData?: (ownProps: LocalVideoContainerOwnProps) => VideoContainerProps;
  /** Optional connection function to map the ACS stream data to the remote media gallery tile. This is only needed
   * if MapToRemoteVideoProps from ACS data layer is not suited for you.
   */
  connectRemoteMediaGalleryTileWithData?: (ownProps: RemoteVideoContainerOwnProps) => VideoContainerProps;
  /** Optional callback to render local media gallery tile. */
  onRenderLocalMediaGalleryTile?: (props: MediaGalleryTileProps) => JSX.Element;
  /** Optional callback to render remote media gallery tile. */
  onRenderRemoteMediaGalleryTile?: (props: MediaGalleryTileProps) => JSX.Element;
}

export const MediaGalleryComponent = (props: MediaGalleryProps): JSX.Element => {
  const [gridCol, setGridCol] = useState(1);
  const [gridRow, setGridRow] = useState(1);

  const {
    localParticipantLabel,
    onRenderLocalMediaGalleryTile,
    onRenderRemoteMediaGalleryTile,
    remoteVideoScalingMode,
    localVideoScalingMode,
    noRemoteVideoAvailableAriaLabel,
    noLocalVideoAvailableAriaLabel,
    connectLocalMediaGalleryTileWithData,
    connectRemoteMediaGalleryTileWithData,
    remoteParticipants
  } = props;

  const calculateNumberOfRows = React.useCallback(
    (participants, gridCol) => Math.ceil((participants.length + 1) / gridCol),
    []
  );
  const calculateNumberOfColumns = React.useCallback(
    (participants) => (participants && participants.length > 0 ? Math.ceil(Math.sqrt(participants.length + 1)) : 1),
    []
  );

  const RemoteMediaGalleryTileWithData = connectFuncsToContext(
    onRenderRemoteMediaGalleryTile ?? MediaGalleryTileComponent,
    connectRemoteMediaGalleryTileWithData ?? MapToRemoteVideoProps
  );

  const mediaGalleryRemoteParticipants = useMemo(() => {
    return remoteParticipants.map((participant, key) => {
      const label = participant.displayName;
      const stream = participant.videoStream;

      return (
        <div className={mediaGalleryStyle} key={key}>
          <RemoteMediaGalleryTileWithData
            label={label}
            stream={stream}
            scalingMode={remoteVideoScalingMode}
            noVideoAvailableAriaLabel={noRemoteVideoAvailableAriaLabel}
          />
        </div>
      );
    });
  }, [remoteParticipants, noRemoteVideoAvailableAriaLabel, remoteVideoScalingMode]);

  const mediaGalleryLocalParticipant: JSX.Element = (
    <div className={mediaGalleryStyle}>
      {connectFuncsToContext(
        onRenderLocalMediaGalleryTile ?? MediaGalleryTileComponent,
        connectLocalMediaGalleryTileWithData ?? MapToLocalVideoProps
      )({
        label: localParticipantLabel,
        scalingMode: localVideoScalingMode,
        noVideoAvailableAriaLabel: noLocalVideoAvailableAriaLabel
      })}
    </div>
  );

  const numberOfColumns = calculateNumberOfColumns(remoteParticipants);
  if (numberOfColumns !== gridCol) setGridCol(numberOfColumns);
  const numberOfRows = calculateNumberOfRows(remoteParticipants, gridCol);
  if (numberOfRows !== gridRow) setGridRow(numberOfRows);

  return (
    <div
      className={mediaGalleryGridStyle}
      style={{
        gridTemplateRows: `repeat(${gridRow}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${gridCol}, 1fr)`
      }}
    >
      {mediaGalleryLocalParticipant}
      {mediaGalleryRemoteParticipants}
    </div>
  );
};

export default connectFuncsToContext(MediaGalleryComponent, MapToMediaGalleryProps);
