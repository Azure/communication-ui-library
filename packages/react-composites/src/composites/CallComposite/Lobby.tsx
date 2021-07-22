// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { StreamMedia, VideoGalleryStream, VideoStreamOptions, VideoTile, useTheme } from '@internal/react-components';
import { LobbyCallControlBar } from './LobbyControlBar';
import { useSelector } from './hooks/useSelector';
import { getIsPreviewCameraOn } from './selectors/baseSelectors';

export interface LobbyProps {
  callState: string;
  localParticipantVideoStream: VideoGalleryStream;
  localVideoViewOption?: VideoStreamOptions;
  isCameraChecked?: boolean;
  isMicrophoneChecked?: boolean;
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  onStartLocalVideo: () => Promise<void>;
  onEndCallClick: () => void;
}

const onRenderEmptyPlaceholder = (): JSX.Element => <></>;

export const Lobby = (props: LobbyProps): JSX.Element => {
  const theme = useTheme();
  const palette = theme.palette;

  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);

  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream.isAvailable;
  const renderElement = videoStream.renderElement;

  const callStateText = props.callState === 'InLobby' ? 'Waiting to be admitted' : 'Connecting...';

  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  useEffect(() => {
    if (
      props.callState === 'InLobby' &&
      isPreviewCameraOn &&
      !isButtonStatusSynced &&
      !isVideoReady &&
      !renderElement
    ) {
      props.onStartLocalVideo().catch((err) => console.log('Can not start video', err));
      setIsButtonStatusSynced(true);
    }
  }, [isButtonStatusSynced, isPreviewCameraOn, isVideoReady, props, renderElement]);

  useEffect(() => {
    if (videoStream && isVideoReady) {
      props.onCreateLocalStreamView &&
        props
          .onCreateLocalStreamView(props.localVideoViewOption)
          .catch((err) => console.log('Can not render video', err));
    }
  }, [isVideoReady, videoStream, props, renderElement]);

  return (
    <VideoTile
      styles={videoTileStyles}
      isVideoReady={isVideoReady}
      renderElement={<StreamMedia videoStreamElement={renderElement ?? null} />}
      onRenderPlaceholder={onRenderEmptyPlaceholder}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: isVideoReady ? '#201f1e' : palette.neutralLight,
          opacity: 0.75
        }}
      />

      <div
        style={{
          textAlign: 'center',
          zIndex: 0,
          width: '50%',
          height: '25%',
          overflow: 'none',
          margin: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
      >
        <p style={{ fontSize: '1.75rem', color: isVideoReady ? 'white' : palette.neutralPrimary }}>
          ☕ <br /> {callStateText}
        </p>
      </div>

      <LobbyCallControlBar isMicrophoneChecked={props.isMicrophoneChecked} onEndCallClick={props.onEndCallClick} />
    </VideoTile>
  );
};
