import {
  CameraButton,
  ControlBar,
  DEFAULT_COMPONENT_ICONS,
  EndCallButton,
  FluentThemeProvider,
  GridLayout,
  MicrophoneButton,
  ScreenShareButton,
  VideoTile,
  useTheme
} from '@azure/communication-react';
import { Stack, mergeStyles, registerIcons } from '@fluentui/react';
import React from 'react';

registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});

const teamsTheme = {
  palette: {
    themePrimary: '#4b53bc',
    themeLighterAlt: '#030308',
    themeLighter: '#0c0d1e',
    themeLight: '#171939',
    themeTertiary: '#2d3271',
    themeSecondary: '#4249a6',
    themeDarkAlt: '#5a61c3',
    themeDark: '#6f76cd',
    themeDarker: '#9196da',
    neutralLighterAlt: '#1e1e1e',
    neutralLighter: '#1d1d1d',
    neutralLight: '#1c1c1c',
    neutralQuaternaryAlt: '#1a1a1a',
    neutralQuaternary: '#191919',
    neutralTertiaryAlt: '#181818',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#1f1f1f'
  }
};

export const TeamsTheme: () => JSX.Element = () => {
  const wrapperStyle = {
    maxWidth: '50rem',
    maxHeight: '30rem',
    height: '20rem'
  };

  return (
    <div style={wrapperStyle}>
      <FluentThemeProvider fluentTheme={teamsTheme}>
        <App />
      </FluentThemeProvider>
    </div>
  );
};

const App: () => JSX.Element = () => {
  const theme = useTheme();

  const headerContainer = mergeStyles({
    height: '3.875rem',
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 2,
    background: theme.palette.white
  });

  const controlBarStyle = {
    root: {
      marginRight: '.5rem',
      alignItems: 'center'
    }
  };

  const teamsButtonStyle = {
    root: { minWidth: '2.75rem' },
    rootHovered: { color: theme.palette.themePrimary, background: 'none' }
  };

  const endCallButtonStyles = {
    root: {
      height: '2rem',
      minHeight: '2rem',
      width: '6.5rem',
      borderRadius: '0.125rem'
    },
    textContainer: {
      display: 'inline-block'
    }
  };

  const videoTileStyle = {
    root: { background: theme.palette.white }
  };

  return (
    <Stack
      verticalFill
      style={{
        background: theme.palette.neutralQuaternaryAlt
      }}
    >
      <Stack className={headerContainer}>
        <Stack.Item>
          <ControlBar styles={controlBarStyle}>
            <CameraButton
              onClick={() => {
                /*handle onClick*/
              }}
              styles={teamsButtonStyle}
            />
            <MicrophoneButton
              onClick={() => {
                /*handle onClick*/
              }}
              styles={teamsButtonStyle}
            />
            <ScreenShareButton
              onClick={() => {
                /*handle onClick*/
              }}
              styles={teamsButtonStyle}
            />
            <EndCallButton
              onClick={() => {
                /*handle onClick*/
              }}
              showLabel={true}
              onRenderText={() => (
                <span key={'endCallBtnTextKey'} style={{ marginLeft: '0.5rem' }}>
                  Leave
                </span>
              )}
              styles={endCallButtonStyles}
            />
          </ControlBar>
        </Stack.Item>
      </Stack>
      <GridLayout>
        <VideoTile displayName={'Michael'} styles={videoTileStyle} />
      </GridLayout>
    </Stack>
  );
};
