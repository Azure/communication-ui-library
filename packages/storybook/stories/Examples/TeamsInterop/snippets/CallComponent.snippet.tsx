import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import { MessageBar } from '@fluentui/react';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { CallControlBar } from './CallControlBar.snippet';
import { bannerMessage, TeamsInterop } from './TeamsInterop.snippet';

export interface CallProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

export const CallComponent = (props: CallProps): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  // Optionally show a message bar for Teams interoperability messages.
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
        {/* Optional Banner */}
        {banner}

        <CallControlBar />
      </VideoTile>
    </FluentThemeProvider>
  );
};
