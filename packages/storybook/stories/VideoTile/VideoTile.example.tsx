import React from 'react';
import { VideoTile, FluentThemeProvider, StreamMedia } from '@azure/communication-ui';
import { renderVideoStream } from '../utils';

export const VideoTileExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <VideoTile
        styles={{ root: { height: '300px', width: '400px' } }}
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
