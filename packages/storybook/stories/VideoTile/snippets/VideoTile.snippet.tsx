import { VideoTile, FluentThemeProvider, StreamMedia } from '@azure/communication-react';
import React from 'react';
import { useVideoStream } from '../../utils';

export const VideoTileExample: () => JSX.Element = () => {
  const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

  const videoStreamElement = useVideoStream(true);

  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        displayName={'Maximus Aurelius'}
        renderElement={
          // NOTE: Replace with your own video provider. (An html element with video stream)
          <StreamMedia videoStreamElement={videoStreamElement} />
        }
        isVideoReady={false}
        isMirrored={true}
      />
    </FluentThemeProvider>
  );
};
