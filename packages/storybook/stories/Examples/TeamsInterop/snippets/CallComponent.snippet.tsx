import { StreamMedia, VideoTile } from '@azure/communication-react';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { Banner } from './Banner.snippet';
import { CallControlBar } from './CallControlBar.snippet';
import { ComplianceBannerState } from './ComplianceBannerExample.snippet';

export interface CallProps {
  teamsInteropCurrent: ComplianceBannerState;
  teamsInteropPrevious: ComplianceBannerState;
}

const renderEmptyPlacehodler = (): JSX.Element => <></>;

export const CallComponent = (props: ComplianceBannerState): JSX.Element => {
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
