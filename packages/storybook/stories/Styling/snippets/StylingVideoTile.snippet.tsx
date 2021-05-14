import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-react';
import React from 'react';
import { renderVideoStream } from '../../utils';

export const VideoTileExample: () => JSX.Element = () => {
  const customStyles = {
    root: { height: '300px', width: '400px' },
    videoContainer: { border: '5px solid firebrick' },
    overlayContainer: { background: 'rgba(165, 13, 13, 0.5)' }
  };

  return (
    <FluentThemeProvider>
      <VideoTile
        isVideoReady={true}
        renderElement={
          // NOTE: Replace with your own video provider. (An html element with video stream)
          <StreamMedia videoStreamElement={renderVideoStream()} />
        }
        displayName={'Jack Reacher'}
        isMirrored={true}
        styles={customStyles}
      ></VideoTile>
    </FluentThemeProvider>
  );
};
