import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  StreamMedia,
  VideoTile,
  VideoTileStylesProps,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { initializeIcons, registerIcons, Stack } from '@fluentui/react';
import React, { useState } from 'react';
import { renderVideoStream } from '../../../utils';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

export const VideoTileExample: () => JSX.Element = () => {
  const customStyles: VideoTileStylesProps = {
    root: { height: '300px', width: '400px' },
    videoContainer: { border: '5px solid red' },
    overlayContainer: { background: 'rgba(165, 13, 13, 0.5)' },
    displayNameContainer: {
      top: '1rem',
      bottom: 'auto',
      right: '1rem',
      left: 'auto',
      backgroundColor: 'blue',
      color: 'white'
    }
  };
  const videoStyles = { root: { '& video': { borderRadius: '0rem' } } };
  const [videoStreams, setVideoStreams] = useState<(HTMLElement | null)[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const onStartVideo = async (): Promise<void> => {
    const videoStreamElement = await renderVideoStream();
    setVideoStreams([videoStreamElement]);
  };
  const onStopVideo = (): void => {
    setVideoStreams([]);
  };

  const videoStreamElement = videoStreams[0];

  return (
    <FluentThemeProvider>
      <Stack style={{ width: '400px' }}>
        <VideoTile
          renderElement={
            // NOTE: Replace with your own video provider. (An html element with video stream)
            videoStreamElement ? <StreamMedia styles={videoStyles} videoStreamElement={videoStreamElement} /> : <></>
          }
          displayName={'Jack Reacher'}
          isMirrored={true}
          isMuted={true}
          styles={customStyles}
        />
        <ControlBar layout="floatingBottom">
          <CameraButton
            onClick={() => {
              if (videoStreams[0]) {
                onStopVideo();
                setIsVideoOn(false);
              } else {
                onStartVideo();
                setIsVideoOn(true);
              }
            }}
            checked={isVideoOn}
          ></CameraButton>
        </ControlBar>
      </Stack>
    </FluentThemeProvider>
  );
};
