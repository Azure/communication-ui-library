import { VideoTile, FluentThemeProvider, StreamMedia } from '@azure/communication-react';
import React from 'react';
import { useVideoStreams } from '../../utils';

export const VideoTileExample: () => JSX.Element = () => {
  const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

  const videoStreamElement = useVideoStreams(1)[0];

  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        displayName={'Maximus Aurelius'}
        showMuteIndicator={true}
        isMuted={true}
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
