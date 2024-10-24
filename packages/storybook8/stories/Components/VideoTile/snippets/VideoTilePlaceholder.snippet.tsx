import { VideoTile, FluentThemeProvider } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const onRenderPlaceholder = (): JSX.Element => (
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
);
export const VideoTilePlaceholderExample: () => JSX.Element = () => {
  const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

  return (
    <FluentThemeProvider>
      <VideoTile
        userId="UserIdPlaceholder"
        styles={videoTileStyles}
        displayName={'Maximus Aurelius'}
        renderElement={null}
        isMirrored={true}
        onRenderPlaceholder={onRenderPlaceholder}
      />
    </FluentThemeProvider>
  );
};
