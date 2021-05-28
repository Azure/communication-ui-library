import {
  StreamMedia,
  VideoTile,
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton
} from '@azure/communication-react';
import { useTheme } from '@fluentui/react-theme-provider';
import React from 'react';

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

  const ControlBarStyles = {
    root: { background: theme.palette.white, minHeight: '4.25rem', alignItems: 'center' }
  };

  return (
    <VideoTile
      styles={videoTileStyles}
      isMirrored={true}
      isVideoReady={props.isVideoReady}
      onRenderPlaceholder={() => <></>}
      renderElement={
        // Replace with your own html local video render element.
        <StreamMedia videoStreamElement={{} as any} />
      }
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

      <div
        style={{
          zIndex: 0,
          textAlign: 'center',
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
        <p style={{ fontSize: '1.75rem', color: props.isVideoReady ? 'white' : palette.neutralPrimary }}>
          ☕ <br /> {props.callStateText}
        </p>
      </div>

      <ControlBar layout="dockedBottom" styles={ControlBarStyles}>
        <CameraButton showLabel={true} checked={true} />
        <MicrophoneButton showLabel={true} checked={true} />
        <OptionsButton showLabel={true} />
        <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} />
      </ControlBar>
    </VideoTile>
  );
};
