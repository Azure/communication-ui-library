import { VideoTile, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const VideoTileExample: () => JSX.Element = () => {
  const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        displayName={'Maximus Aurelius'}
        showMuteIndicator={true}
        isMuted={true}
        renderElement={null}
        isMirrored={true}
      />
    </FluentThemeProvider>
  );
};
