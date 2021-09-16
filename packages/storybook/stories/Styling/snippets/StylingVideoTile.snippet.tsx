import { FluentThemeProvider, StreamMedia, VideoTile, VideoTileStylesProps } from '@azure/communication-react';
import React from 'react';
import { useVideoStreams } from '../../utils';

export const VideoTileExample: () => JSX.Element = () => {
  const customStyles: VideoTileStylesProps = {
    root: { height: '300px', width: '400px' },
    videoContainer: { border: '5px solid firebrick' },
    overlayContainer: { background: 'rgba(165, 13, 13, 0.5)' },
    displayNameContainer: { top: '1em', bottom: 'auto', right: '1em', left: 'auto', backgroundColor: 'blue' }
  };

  const videoStreamElement = useVideoStreams(1)[0];

  return (
    <FluentThemeProvider>
      <VideoTile
        renderElement={
          // NOTE: Replace with your own video provider. (An html element with video stream)
          <StreamMedia videoStreamElement={videoStreamElement} />
        }
        displayName={'Jack Reacher'}
        isMirrored={true}
        isMuted={true}
        styles={customStyles}
      />
    </FluentThemeProvider>
  );
};
