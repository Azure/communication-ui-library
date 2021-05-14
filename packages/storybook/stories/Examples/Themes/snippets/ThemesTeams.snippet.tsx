import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  GridLayout,
  MicrophoneButton,
  ScreenShareButton,
  VideoTile
} from '@azure/communication-react';
import React from 'react';

const TeamsTheme = {
  palette: {
    themePrimary: '#4b53bc',
    themeLighterAlt: '#f6f7fc',
    themeLighter: '#dddef4',
    themeLight: '#c1c4eb',
    themeTertiary: '#8a8fd7',
    themeSecondary: '#5d64c5',
    themeDarkAlt: '#444baa',
    themeDark: '#393f8f',
    themeDarker: '#2a2e6a',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff'
  }
};

export const TeamsLikeTheme: () => JSX.Element = () => {
  return (
    <FluentThemeProvider fluentTheme={TeamsTheme}>
      <div
        style={{
          height: '530px',
          width: '830px'
        }}
      >
        <GridLayout>
          <VideoTile isVideoReady={false} videoProvider={null} displayName={'Michael'}>
            {/*Control Bar with default set up*/}
            <ControlBar layout={'dockedTop'}>
              <CameraButton
                onClick={() => {
                  /*handle onClick*/
                }}
              />
              <MicrophoneButton
                onClick={() => {
                  /*handle onClick*/
                }}
              />
              <ScreenShareButton
                onClick={() => {
                  /*handle onClick*/
                }}
              />
              <EndCallButton
                onClick={() => {
                  /*handle onClick*/
                }}
              />
            </ControlBar>
            {/*Control Bar with default set up*/}
            <label>Michael</label>
          </VideoTile>
        </GridLayout>
      </div>
    </FluentThemeProvider>
  );
};
