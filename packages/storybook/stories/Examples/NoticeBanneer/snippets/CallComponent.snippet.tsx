import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { Banner } from './Banner.snippet';
import { CallControlBar } from './CallControlBar.snippet';

export const CallComponent = (): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        invertVideo={true}
        isVideoReady={true}
        videoProvider={
          // Replace with your own video provider.
          <StreamMedia videoStreamElement={renderVideoStream()} />
        }
        placeholderProvider={<></>}
      >
        <Banner />
        <CallControlBar />
      </VideoTile>
    </FluentThemeProvider>
  );
};
