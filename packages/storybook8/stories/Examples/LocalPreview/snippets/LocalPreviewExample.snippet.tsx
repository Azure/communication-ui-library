import {
  StreamMedia,
  VideoTile,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  FluentThemeProvider,
  useTheme,
  VideoTileStylesProps
} from '@azure/communication-react';
import { Stack, mergeStyles, Text, ITheme } from '@fluentui/react';
import { VideoOff20Filled } from '@fluentui/react-icons';
import React, { useState } from 'react';
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
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(true);
  const theme = useTheme();

  const shouldShowLocalVideo = isVideoAvailable && isCameraEnabled && camera;
  return (
    <div style={{ height: '17.188rem' }}>
      <FluentThemeProvider fluentTheme={theme}>
        <Stack style={{ width: '100\u0025', height: '100\u0025' }} verticalAlign="center">
          <Stack.Item align="center">
            <Stack className={localPreviewContainerMergedStyles(theme)}>
              <VideoTile
                styles={videoTileStyle}
                // Here this storybook example isn't connected with Azure Communication Services
                // We would suggest you replace this videoStreamElement below with a rendered video stream from the calling SDK
                renderElement={shouldShowLocalVideo ? <LocalVideoElement /> : undefined}
                onRenderPlaceholder={() => <CameraOffPlaceholder />}
              >
                <ControlBar layout="floatingBottom">
                  <CameraButton
                    disabled={!isCameraEnabled}
                    checked={isCameraEnabled ? camera : false}
                    onClick={() => setCamera(!camera)}
                  />
                  <MicrophoneButton
                    disabled={!isMicrophoneEnabled}
                    checked={isMicrophoneEnabled ? microphone : false}
                    onClick={() => setMicrophone(!microphone)}
                  />
                </ControlBar>
              </VideoTile>
            </Stack>
          </Stack.Item>
        </Stack>
      </FluentThemeProvider>
    </div>
  );
};

const CameraOffPlaceholder = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack style={{ width: '100\u0025', height: '100\u0025' }} verticalAlign="center">
      <Stack.Item align="center">
        <VideoOff20Filled primaryFill="currentColor" />
      </Stack.Item>
      <Stack.Item align="center">
        <Text className={cameraOffLabelMergedStyles(theme)}>Your camera is turned off</Text>
      </Stack.Item>
    </Stack>
  );
};

/**
 * This component ties the lifetime of the media stream to the {@link StreamMedia} component.
 *
 * This ensures that the video stream is properly stopped when the component unmounts.
 */
const LocalVideoElement = (): JSX.Element => {
  const videoStreamElement = useVideoStreams(1)[0];
  return videoStreamElement ? <StreamMedia videoStreamElement={videoStreamElement} /> : <></>;
};

const localPreviewContainerMergedStyles = (theme: ITheme): string =>
  mergeStyles({
    minWidth: '25rem',
    width: '100\u0025',
    height: '100\u0025',
    maxHeight: '18.75rem',
    minHeight: '16.875rem',
    margin: '0 auto',
    background: theme.palette.neutralLighter,
    color: theme.palette.neutralTertiary
  });

const cameraOffLabelMergedStyles = (theme: ITheme): string =>
  mergeStyles({
    fontFamily: 'Segoe UI Regular',
    fontSize: '0.625rem', // 10px
    color: theme.palette.neutralTertiary
  });

const videoTileStyle: VideoTileStylesProps = {
  root: {
    minHeight: '14rem'
  }
};
