import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { TeamsInterop, bannerMessage } from './TeamsInterop.snippet';
import { CallControlBar } from './CallControlBar.snippet';
import { MessageBar } from '@fluentui/react';

export interface CallProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

export const CallComponent = (props: CallProps): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  const msg = bannerMessage(props);
  const banner = msg !== null ? <MessageBar>{msg}</MessageBar> : <></>;
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
        {banner}
        <CallControlBar />
      </VideoTile>
    </FluentThemeProvider>
  );
};
