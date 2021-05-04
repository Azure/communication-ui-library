import { StreamMedia, VideoTile } from '@azure/react-components';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { Banner } from './Banner.snippet';
import { CallControlBar } from './CallControlBar.snippet';
import { TeamsInterop } from './TeamsInterop.snippet';

export interface CallProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

export const CallComponent = (props: TeamsInterop): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  return (
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
      <Banner {...props} />

      <CallControlBar />
    </VideoTile>
  );
};
