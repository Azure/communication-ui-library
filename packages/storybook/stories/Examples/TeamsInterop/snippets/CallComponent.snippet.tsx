import { StreamMedia, VideoTile } from '@azure/communication-react';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { ComplianceBannerExample } from './ComplianceBannerExample.snippet';
import { CallControlBar } from './CallControlBar.snippet';
import { ComplianceBanner } from './ComplianceBanner.snippet';

export interface CallProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

const renderEmptyPlacehodler = (): JSX.Element => <></>;

export const CallComponent = (props: TeamsInterop): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  return (
    <VideoTile
      styles={videoTileStyles}
      isMirrored={true}
      isVideoReady={true}
      renderElement={
        // Replace with your own video provider.
        <StreamMedia videoStreamElement={renderVideoStream()} />
      }
      onRenderPlaceholder={renderEmptyPlacehodler}
    >
      {/* Optional Banner */}
      <Banner {...props} />

      <CallControlBar />
    </VideoTile>
  );
};
