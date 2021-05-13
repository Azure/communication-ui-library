import { VideoTile, FluentThemeProvider, StreamMedia } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
import { renderVideoStream } from '../../utils';

export const VideoTilePlaceholderExample: () => JSX.Element = () => {
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
        isMirrored={true}
        placeholderProvider={
          <Stack>
            <img
              src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
              style={{
                borderRadius: '150px',
                width: '150px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        }
      />
    </FluentThemeProvider>
  );
};
