import {
  StreamMedia,
  VideoTile,
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  useTheme
} from '@azure/communication-react';
import React from 'react';
import { useVideoStreams } from '../../../utils';

export interface LobbyProps {
  isVideoReady: boolean;
  callStateText: string;
  callStateSubText: string;
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

  const videoStreams = useVideoStreams(1);
  const videoStreamElement = props.isVideoReady ? videoStreams[0] : null;

  return (
    <VideoTile
      styles={videoTileStyles}
      isMirrored={true}
      onRenderPlaceholder={() => <></>}
      renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '-2.125rem'
        }}
      >
        <p
          style={{
            fontSize: '1.75rem',
            color: props.isVideoReady ? 'white' : palette.neutralPrimary,
            textAlign: 'center',
            margin: '0'
          }}
        >
          ☕ <br /> {props.callStateText} <br />
        </p>
        <p
          style={{
            fontSize: '0.75rem',
            color: props.isVideoReady ? 'white' : palette.neutralPrimary,
            textAlign: 'center',
            margin: '0'
          }}
        >
          {props.callStateSubText}
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
