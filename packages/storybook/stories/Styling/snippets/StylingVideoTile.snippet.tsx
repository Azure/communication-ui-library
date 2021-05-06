import React from 'react';
import { FluentThemeProvider, StreamMedia, VideoTile } from 'react-components';
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
        videoProvider={
          // NOTE: Replace with your own video provider. (An html element with video stream)
          <StreamMedia videoStreamElement={renderVideoStream()} />
        }
        avatarName={'Jack Reacher'}
        invertVideo={true}
        styles={customStyles}
      ></VideoTile>
    </FluentThemeProvider>
  );
};
