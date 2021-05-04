import React from 'react';
import { VideoTile, FluentThemeProvider, StreamMedia } from '@azure/react-components';
import { renderVideoStream } from '../../utils';

export const VideoTileExample: () => JSX.Element = () => {
  const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };
  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        avatarName={'Maximus Aurelius'}
        videoProvider={
          // NOTE: Replace with your own video provider. (An html element with video stream)
          <StreamMedia videoStreamElement={renderVideoStream()} />
        }
        isVideoReady={false}
        invertVideo={true}
      />
    </FluentThemeProvider>
  );
};
