import {
  StreamMedia,
  VideoTile,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  FluentThemeProvider,
  useTheme
} from '@azure/communication-react';
import { Stack, mergeStyles, Text } from '@fluentui/react';
import { VideoOff20Filled } from '@fluentui/react-icons';
import React, { useCallback, useState } from 'react';
import { useVideoStreams } from '../../../utils';

export interface LocalPreviewProps {
  isVideoAvailable: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
}

export const LocalPreviewExample = ({
  isVideoAvailable,
  isCameraEnabled,
  isMicrophoneEnabled
}: LocalPreviewProps): JSX.Element => {
  const [microphone, setMicrophone] = useState(false);
  const [camera, setCamera] = useState(false);
  const theme = useTheme();
  const palette = theme.palette;

  const localPreviewContainerStyle = mergeStyles({
    minWidth: '25rem',
    width: '100\u0025',
    height: '100\u0025',
    maxHeight: '18.75rem',
    minHeight: '16.875rem',
    margin: '0 auto',
    background: palette.neutralLighter,
    color: palette.neutralTertiary
  });

  const videoTileStyle = {
    root: {
      minHeight: '14rem'
    }
  };

  const cameraOffLabelStyle = mergeStyles({
    fontFamily: 'Segoe UI Regular',
    fontSize: '0.625rem', // 10px
    color: palette.neutralTertiary
  });

  const renderCameraOffPlaceholder = useCallback(
    () => (
      <Stack style={{ width: '100\u0025', height: '100\u0025' }} verticalAlign="center">
        <Stack.Item align="center">
          <VideoOff20Filled primaryFill="currentColor" />
        </Stack.Item>
        <Stack.Item align="center">
          <Text className={cameraOffLabelStyle}>Your camera is turned off</Text>
        </Stack.Item>
      </Stack>
    ),
    [cameraOffLabelStyle]
  );

  const videoStreamElement = useVideoStreams(1)[0];

  return (
    <FluentThemeProvider fluentTheme={theme}>
      <Stack style={{ width: '100\u0025', height: '100\u0025' }} verticalAlign="center">
        <Stack.Item align="center">
          <Stack className={localPreviewContainerStyle}>
            <VideoTile
              styles={videoTileStyle}
              isVideoReady={isVideoAvailable}
              // Here this storybook example isn't connected with Azure Communication Services
              // We would suggest you replace this videoStreamElement below with a rendered video stream from the calling SDK
              renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
              onRenderPlaceholder={renderCameraOffPlaceholder}
            >
              <ControlBar layout="floatingBottom">
                <CameraButton disabled={!isCameraEnabled} checked={camera} onClick={() => setCamera(!camera)} />
                <MicrophoneButton
                  disabled={!isMicrophoneEnabled}
                  checked={microphone}
                  onClick={() => setMicrophone(!microphone)}
                />
              </ControlBar>
            </VideoTile>
          </Stack>
        </Stack.Item>
      </Stack>
    </FluentThemeProvider>
  );
};
