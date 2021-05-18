import { StreamMedia, VideoTile } from '@azure/communication-react';
import { useTheme } from '@fluentui/react-theme-provider';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { LobbyCallControlBar } from './LobbyControlBar.snippet';

export interface LobbyProps {
  isVideoReady: boolean;
  callStateText: string;
}

export const Lobby = (props: LobbyProps): JSX.Element => {
  const theme = useTheme();
  const palette = theme.palette;

  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  return (
    <VideoTile
      styles={videoTileStyles}
      isMirrored={true}
      isVideoReady={props.isVideoReady}
      renderElement={
        // Replace with your own video provider.
        <StreamMedia videoStreamElement={renderVideoStream()} />
      }
      placeholder={<></>}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: props.isVideoReady ? '#201f1e' : palette.neutralLight,
          opacity: 0.75
        }}
      />

      <div style={{ textAlign: 'center', margin: 'auto', zIndex: 0 }}>
        <p style={{ fontSize: '1.75rem', color: props.isVideoReady ? 'white' : palette.neutralPrimary }}>
          ☕ <br /> {props.callStateText}
        </p>
      </div>

      <LobbyCallControlBar />
    </VideoTile>
  );
};
