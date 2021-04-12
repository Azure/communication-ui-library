import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import { getTheme } from '@fluentui/react';
import React from 'react';
import { renderVideoStream } from '../../utils';
import { LobbyCallControlBar } from './LobbyControlBar.example';

const theme = getTheme();
const palette = theme.palette;

export interface LobbyProps {
  isVideoReady: boolean;
  callStateText: string;
}

export const Lobby = (props: LobbyProps): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        invertVideo={true}
        isVideoReady={props.isVideoReady}
        videoProvider={
          // Replace with your own video provider.
          <StreamMedia videoStreamElement={renderVideoStream()} />
        }
        placeholderProvider={<></>}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            background: props.isVideoReady ? palette.themeDarker : palette.neutralLight,
            opacity: 0.8
          }}
        />

        <div style={{ textAlign: 'center', margin: 'auto', zIndex: 1 }}>
          <p style={{ fontSize: '1.75rem', color: props.isVideoReady ? palette.neutralLight : palette.neutralPrimary }}>
            ☕ <br /> {props.callStateText}
          </p>
        </div>

        <LobbyCallControlBar />
      </VideoTile>
    </FluentThemeProvider>
  );
};
